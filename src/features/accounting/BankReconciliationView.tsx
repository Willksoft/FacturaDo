import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, XCircle } from 'lucide-react';
import { FinancialAccount, Receipt, Expense, BankTransaction } from '../../types';
import { insforge } from '../../lib/insforge';

interface BankReconciliationViewProps {
  financialAccounts: FinancialAccount[];
  receipts: Receipt[];
  expenses: Expense[];
  currentUser: any;
}

export function BankReconciliationView({ financialAccounts, receipts, expenses, currentUser }: BankReconciliationViewProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  
  // CSV Parse state
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    if (selectedAccountId) {
      loadTransactions(selectedAccountId);
    }
  }, [selectedAccountId]);

  const loadTransactions = async (accountId: string) => {
    setLoading(true);
    const userPrefix = `${currentUser.id}_`;
    const { data, error } = await insforge.database
      .from('bank_transactions')
      .select('*')
      .eq('account_id', `${userPrefix}${accountId}`)
      .order('date', { ascending: false });

    if (!error && data) {
      setTransactions(data.map(d => ({
        id: d.id.replace(userPrefix, ''),
        accountId: d.account_id.replace(userPrefix, ''),
        date: d.date,
        description: d.description,
        amount: Number(d.amount),
        reference: d.reference,
        isReconciled: d.is_reconciled,
        matchedEntityType: d.matched_entity_type,
        matchedEntityId: d.matched_entity_id?.replace(userPrefix, ''),
        createdAt: d.created_at
      })));
    }
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAccountId) return;
    
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim() !== '');
      
      const newTx: BankTransaction[] = [];
      const userPrefix = `${currentUser.id}_`;

      // Smart CSV Parser for Dominican Banks (Popular, BHD, Banreservas, Scotiabank)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Split by comma or semicolon
        const delimiter = line.includes(';') ? ';' : ',';
        const cols = line.split(delimiter).map(c => c.replace(/^"|"$/g, '').trim());
        
        if (cols.length >= 3) {
          const rawDate = cols[0];
          let parsedDate = new Date();

          // Support DD/MM/YYYY or YYYY-MM-DD
          if (rawDate.includes('/')) {
            const parts = rawDate.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const year = parseInt(parts[2], 10);
              if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                parsedDate = new Date(year < 100 ? year + 2000 : year, month, day);
              }
            }
          } else if (rawDate.includes('-')) {
            parsedDate = new Date(rawDate);
          }

          if (isNaN(parsedDate.getTime())) parsedDate = new Date();

          const desc = cols[1] || 'Movimiento Bancario';
          let amount = 0;
          let ref = cols[2] || '';

          // If columns has Debit and Credit (cols length >= 5)
          if (cols.length >= 5) {
            const debitStr = cols[3] ? cols[3].replace(/[^0-9.-]+/g, '') : '';
            const creditStr = cols[4] ? cols[4].replace(/[^0-9.-]+/g, '') : '';
            const debit = parseFloat(debitStr) || 0;
            const credit = parseFloat(creditStr) || 0;

            if (credit > 0) amount = credit;
            else if (debit > 0) amount = -debit;
            else amount = parseFloat(cols[2].replace(/[^0-9.-]+/g, '')) || 0;
          } else {
            // Single amount column
            const cleanAmt = cols[2].replace(/[^0-9.-]+/g, '');
            amount = parseFloat(cleanAmt);
            if (cols.length >= 4) ref = cols[3];
          }

          if (isNaN(amount) || amount === 0) continue;

          let matchedType: 'receipt' | 'expense' | null = null;
          let matchedId: string | null = null;
          let isReconciled = false;

          // Auto-Match Logic
          if (amount > 0) {
            // Ingreso -> Receipt
            const match = receipts.find(r => Math.abs(r.amountPaid - amount) < 0.01 && !(r as any).isDeleted);
            if (match) {
              matchedType = 'receipt';
              matchedId = match.id;
              isReconciled = true;
            }
          } else {
            // Egreso -> Expense
            const match = expenses.find(e => Math.abs(e.amount - Math.abs(amount)) < 0.01 && !(e as any).isDeleted);
            if (match) {
              matchedType = 'expense';
              matchedId = match.id;
              isReconciled = true;
            }
          }

          const txId = `btx-${Date.now()}-${i}`;
          newTx.push({
            id: txId,
            accountId: selectedAccountId,
            date: parsedDate.toISOString(),
            description: desc,
            amount,
            reference: ref,
            isReconciled,
            matchedEntityType: matchedType,
            matchedEntityId: matchedId,
            createdAt: new Date().toISOString()
          });
        }
      }

      if (newTx.length > 0) {
        // Save to DB
        const dbTxs = newTx.map(t => ({
          id: `${userPrefix}${t.id}`,
          account_id: `${userPrefix}${t.accountId}`,
          date: t.date,
          description: t.description,
          amount: t.amount,
          reference: t.reference,
          is_reconciled: t.isReconciled,
          matched_entity_type: t.matchedEntityType,
          matched_entity_id: t.matchedEntityId ? `${userPrefix}${t.matchedEntityId}` : null,
        }));

        await insforge.database.from('bank_transactions').insert(dbTxs);
        loadTransactions(selectedAccountId);
      }
      setIsParsing(false);
    };
    reader.readAsText(file);
  };

  const manualReconcile = async (txId: string) => {
    const userPrefix = `${currentUser.id}_`;
    await insforge.database.from('bank_transactions').update({ is_reconciled: true }).eq('id', `${userPrefix}${txId}`);
    setTransactions(transactions.map(t => t.id === txId ? { ...t, isReconciled: true } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Conciliación Bancaria</h2>
          <p className="text-sm text-neutral-500">Importa extractos bancarios y asocia movimientos con FacturaDo.</p>
        </div>
      </div>

      <Card className="border-neutral-200">
        <CardHeader className="bg-neutral-50 border-b border-neutral-100 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-xs">
              <Label className="text-xs mb-1 block">Cuenta Bancaria</Label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Seleccione una cuenta..." />
                </SelectTrigger>
                <SelectContent>
                  {financialAccounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id}>{acc.name} ({acc.bankName})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedAccountId && (
              <div className="flex-1">
                <Label className="text-xs mb-1 block">Importar Extracto CSV</Label>
                <div className="relative">
                  <Input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileUpload}
                    disabled={isParsing}
                    className="h-9 cursor-pointer file:cursor-pointer file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-semibold file:mr-4 file:px-3 file:py-1 file:rounded-md hover:file:bg-blue-100" 
                  />
                  {isParsing && <span className="absolute right-3 top-2 text-xs text-blue-600 animate-pulse">Procesando...</span>}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Fecha</TableHead>
                <TableHead>Descripción Bancaria</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Sugerencia del Sistema</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!selectedAccountId ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-neutral-400">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Seleccione una cuenta bancaria para visualizar la conciliación.
                  </TableCell>
                </TableRow>
              ) : loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Cargando transacciones...</TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-neutral-400">
                    No hay transacciones importadas. Sube un archivo CSV.
                    <p className="text-xs mt-2">Formato esperado: Fecha, Descripción, Monto</p>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-xs text-neutral-500">{new Date(tx.date).toLocaleDateString('es-DO')}</TableCell>
                    <TableCell className="text-xs font-semibold">{tx.description}</TableCell>
                    <TableCell className={`text-right font-mono text-xs font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                    </TableCell>
                    <TableCell className="text-xs">
                      {tx.matchedEntityType ? (
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-neutral-400">{tx.matchedEntityType === 'receipt' ? 'Factura/Ingreso' : 'Egreso'}</span>
                          <span className="font-semibold text-neutral-800 text-xs truncate max-w-[200px]">Asociado automáticamente</span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">No se encontró match exacto</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {tx.isReconciled ? (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Conciliado
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Por Revisar
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!tx.isReconciled && (
                        <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold" onClick={() => manualReconcile(tx.id)}>
                          Validar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
