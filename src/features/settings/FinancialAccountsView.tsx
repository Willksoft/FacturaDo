import React, { useState } from 'react';
import { FinancialAccount, Receipt } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Landmark, CreditCard, Wallet, Plus, ArrowUpRight, ArrowDownRight, ClipboardList, PiggyBank } from 'lucide-react';

interface FinancialAccountsViewProps {
  financialAccounts: FinancialAccount[];
  receipts: Receipt[];
  addFinancialAccount: (acc: Omit<FinancialAccount, 'id' | 'createdAt'>) => FinancialAccount;
  updateFinancialAccount: (id: string, fields: Partial<FinancialAccount>) => void;
  deleteFinancialAccount: (id: string) => void;
}

export default function FinancialAccountsView({
  financialAccounts,
  receipts,
  addFinancialAccount,
  updateFinancialAccount,
  deleteFinancialAccount,
}: FinancialAccountsViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'Banco' | 'Caja' | 'Verifone'>('Banco');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('0');

  const [selectedAcc, setSelectedAcc] = useState<FinancialAccount | null>(financialAccounts[0] || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newAcc = addFinancialAccount({
      name,
      type,
      bankName: type === 'Banco' ? bankName : undefined,
      accountNumber: type === 'Banco' ? accountNumber : undefined,
      balance: Number(balance) || 0,
    });

    setName('');
    setType('Banco');
    setBankName('');
    setAccountNumber('');
    setBalance('0');
    setModalOpen(false);
    setSelectedAcc(newAcc);
  };

  // Get total cash, bank and verifone equity
  const totalEquity = financialAccounts.reduce((acc, current) => acc + current.balance, 0);

  // Filter receipt logs deposited to this account/cash-drawer
  const accountReceipts = receipts.filter(r => r.accountId === (selectedAcc?.id || ''));

  const getAccountIcon = (accountType: FinancialAccount['type']) => {
    switch (accountType) {
      case 'Banco': return <Landmark className="w-5 h-5 text-blue-600" />;
      case 'Verifone': return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'Caja': return <Wallet className="w-5 h-5 text-emerald-600" />;
      default: return <PiggyBank className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6" id="banking-module-root">
      {/* GENERAL BALANCE STATS BOX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="banking-totals-belt">
        <Card className="border-neutral-200 shadow-none rounded-xl bg-neutral-950 text-white">
          <CardContent className="p-5 flex items-center space-x-3">
            <div className="p-2 border border-neutral-800 rounded-lg bg-neutral-900 text-neutral-300">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-none">Fondos Disponibles Totales</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {totalEquity.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-none rounded-xl">
          <CardContent className="p-5 flex items-center space-x-3">
            <div className="p-2 border border-neutral-150 rounded-lg bg-neutral-50 text-neutral-850">
              <Landmark className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-none">Cuentas de Banco</span>
              <span className="text-base font-bold font-mono text-neutral-900 mt-1 block">
                {financialAccounts.filter(acc => acc.type === 'Banco').reduce((s, acc) => s + acc.balance, 0).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-none rounded-xl bg-white">
          <CardContent className="p-5 flex items-center space-x-3">
            <div className="p-2 border border-neutral-150 rounded-lg bg-neutral-50 text-neutral-850">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-none">Verifones & Cajas</span>
              <span className="text-base font-bold font-mono text-neutral-900 mt-1 block">
                {financialAccounts.filter(acc => acc.type !== 'Banco').reduce((s, acc) => s + acc.balance, 0).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LIST OF REGISTERED ACCOUNTS / REGISTRIES - (1 COLUMN) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">Cajas y Cuentas</h3>
            <Button 
              onClick={() => setModalOpen(true)}
              size="sm" 
              className="bg-black hover:bg-neutral-800 text-white font-semibold text-xs h-8 px-2.5 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Nueva Cuenta
            </Button>
          </div>

          <div className="space-y-3">
            {financialAccounts.map(acc => {
              const isSelected = selectedAcc?.id === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => setSelectedAcc(acc)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'bg-neutral-950 border-neutral-950 text-white shadow-md' 
                      : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 border rounded-lg ${isSelected ? 'bg-neutral-900 border-neutral-850 text-white' : 'bg-neutral-100 text-neutral-700'}`}>
                      {getAccountIcon(acc.type)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight block">{acc.name}</h4>
                      {acc.type === 'Banco' && acc.accountNumber && (
                        <span className={`text-[10px] font-mono leading-none ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          # {acc.accountNumber}
                        </span>
                      )}
                      {acc.type === 'Verifone' && (
                        <span className="text-[10px] uppercase font-bold text-purple-400">Terminal Digital</span>
                      )}
                      {acc.type === 'Caja' && (
                        <span className="text-[10px] uppercase font-bold text-emerald-400">Efectivo Físico</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono block">
                      {acc.balance.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACCOUNT MOVEMENTS AND DEPOSITS VIEW - (2 COLUMNS) */}
        <div className="lg:col-span-2">
          {selectedAcc ? (
            <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
              <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-neutral-900 flex items-center">
                    <Landmark className="w-4 h-4 mr-2 text-neutral-850" />
                    Historial de Cobros en Cuenta: {selectedAcc.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {selectedAcc.type === 'Banco' 
                      ? `Entidad: ${selectedAcc.bankName || 'Fiduciario'} | Nro Cuenta: ${selectedAcc.accountNumber || 'N/A'}` 
                      : 'Registro de fondos directos procedentes de ventas rápidas y cobros POS'
                    }
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-neutral-50/50">
                    <TableRow>
                      <TableHead className="text-xs text-neutral-700">Recibo</TableHead>
                      <TableHead className="text-xs text-neutral-700">Cliente</TableHead>
                      <TableHead className="text-xs text-neutral-700">Fecha de Cobro</TableHead>
                      <TableHead className="text-right text-xs text-neutral-700">Monto Recibido</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountReceipts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-neutral-400 py-16 text-xs">
                          No se han registrado cobros o depósitos procedentes de facturas en esta cuenta. Las ventas POS en efectivo o cheques se registrarán aquí.
                        </TableCell>
                      </TableRow>
                    ) : (
                      accountReceipts.map(r => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs text-neutral-500">{r.receiptNumber}</TableCell>
                          <TableCell className="font-bold text-neutral-950 text-xs sm:text-xs">
                            {r.clientName}
                          </TableCell>
                          <TableCell className="text-xs text-neutral-600">
                            {new Date(r.date).toLocaleDateString('es-DO', { hour: 'numeric', minute: 'numeric' })}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs font-bold text-emerald-700">
                            + {r.amountPaid.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white border rounded-xl border-dashed border-neutral-300 p-12 text-center text-xs text-neutral-400">
              Seleccione una cuenta financiera a la izquierda para visualizar su estado de conciliación bancaria.
            </div>
          )}
        </div>
      </div>

      {/* DIALOG TO CREATE NEW FINANCIAL ACCOUNT */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-neutral-900">Crear Cuenta Financiera / Verifone / Caja</DialogTitle>
              <DialogDescription className="text-xs">Asocie cuentas de banco y cajas físicas para rastrear el flujo de dinero real de las ventas cobradas.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="space-y-1">
                <Label htmlFor="acc-type" className="text-xs font-semibold text-neutral-800">Tipo de Recurso Financiero</Label>
                <Select value={type} onValueChange={(val: any) => setType(val)}>
                  <SelectTrigger id="acc-type" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Banco">Cuenta de Banco (Ahorro/Corriente)</SelectItem>
                    <SelectItem value="Caja">Caja Chica / Efectivo Físico</SelectItem>
                    <SelectItem value="Verifone">Verifone / Procesador Tarjetas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="acc-name" className="text-xs font-semibold text-neutral-800">Nombre Descriptivo de la Cuenta *</Label>
                <Input id="acc-name" placeholder="Ej. Banreservas Cuenta Corriente o Caja Chica Tienda" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              {type === 'Banco' && (
                <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-3 rounded-lg border border-neutral-150">
                  <div className="space-y-1">
                    <Label htmlFor="acc-bank" className="text-xs font-semibold">Banco Emisor</Label>
                    <Input id="acc-bank" placeholder="Ej. Banreservas" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="acc-number" className="text-xs font-semibold">Nro de Cuenta</Label>
                    <Input id="acc-number" placeholder="Ej. 100-2022-XX" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="acc-balance" className="text-xs font-semibold text-neutral-800">Balance Inicial RD$</Label>
                <Input id="acc-balance" type="number" step="0.01" placeholder="Ej. 75000" value={balance} onChange={(e) => setBalance(e.target.value)} />
                <p className="text-[10px] text-neutral-400 leading-none">Fondos liquidados de apertura antes de cobros en el sistema.</p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" size="sm" className="bg-black text-white hover:bg-neutral-800">Aperturar Cuenta Financiera</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
