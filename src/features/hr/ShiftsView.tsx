import React, { useState } from 'react';
import { Shift, UserPermission, FinancialAccount, Seller } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Calendar, PlayCircle, StopCircle, Calculator, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ShiftsViewProps {
  shifts: Shift[];
  activeShift: Shift | null;
  addShift: (sh: Omit<Shift, 'id'>) => void | Promise<void>;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  users: UserPermission[];
  financialAccounts: FinancialAccount[];
  currentUser: UserPermission;
  sellers?: Seller[];
  receipts?: any[];
}

export default function ShiftsView({
  shifts,
  activeShift,
  addShift,
  updateShift,
  users,
  financialAccounts,
  currentUser,
  sellers = [],
  receipts = []
}: ShiftsViewProps) {
  // Open Shift Form State
  const [openingBalance, setOpeningBalance] = useState('0');
  const [selectedCajaId, setSelectedCajaId] = useState('');
  const [selectedShiftSellerId, setSelectedShiftSellerId] = useState('sel-admin-default');

  // Derived: active sellers list with Administrador always present as fallback
  const activeSellers = sellers.filter(s => s.isActive);
  const hasAdminFallback = activeSellers.some(s => s.id === 'sel-admin-default');
  const displaySellers = hasAdminFallback ? activeSellers : [
    { id: 'sel-admin-default', name: 'Administrador', isActive: true, commissionRate: 0, createdAt: '' },
    ...activeSellers
  ];
  const selectedSellerName = displaySellers.find(s => s.id === selectedShiftSellerId)?.name || 'Administrador';

  // Close Shift Form State
  const [closingBalanceActual, setClosingBalanceActual] = useState('');

  const cajas = financialAccounts.filter(acc => acc.type === 'Caja');

  const activeShiftCashPayments = React.useMemo(() => {
    if (!activeShift) return 0;
    return receipts
      .filter(r => {
        const isAfterStart = new Date(r.date) >= new Date(activeShift.startTime);
        const isCash = r.paymentMethod === 'Efectivo';
        const isThisCaja = r.accountId === activeShift.cajaId;
        return isAfterStart && isCash && isThisCaja;
      })
      .reduce((sum, r) => sum + r.amountPaid, 0);
  }, [activeShift, receipts]);

  const expectedClosingBalance = React.useMemo(() => {
    if (!activeShift) return 0;
    return activeShift.openingBalance + activeShiftCashPayments;
  }, [activeShift, activeShiftCashPayments]);

  const handleOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCajaId) {
      alert('Por favor seleccione una caja física para operar.');
      return;
    }
    const chosenSeller = sellers.find(s => s.id === selectedShiftSellerId);
    if (!selectedShiftSellerId || !chosenSeller) {
      alert('Por favor seleccione un vendedor para abrir el turno.');
      return;
    }
    
    addShift({
      startTime: new Date().toISOString(),
      openingBalance: parseFloat(openingBalance) || 0,
      openedById: chosenSeller.id,
      openedByName: chosenSeller.name,
      status: 'Abierto',
      cajaId: selectedCajaId
    });
    setOpeningBalance('0');
    setSelectedCajaId('');
    setSelectedShiftSellerId('sel-admin-default');
  };

  const handleCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;

    // Simulate expected balance computation
    // Real implementation should sum all payments associated with this shift
    // For now we ask the user for the real balance in register
    const actual = parseFloat(closingBalanceActual) || 0;
    const expected = expectedClosingBalance;
    const discrepancy = actual - expected;

    updateShift(activeShift.id, {
      endTime: new Date().toISOString(),
      closingBalanceActual: actual,
      closingBalanceExpected: expected,
      discrepancy,
      closedById: currentUser.id,
      closedByName: currentUser.username,
      status: 'Cerrado'
    });
    setClosingBalanceActual('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Turnos y Cuadre de Caja</h2>
          <p className="text-muted-foreground">Administre aperturas y cierres de turno para el control de efectivo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Shift Card or Open New */}
        {activeShift ? (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <PlayCircle className="h-5 w-5" />
                Turno Actual Abierto
              </CardTitle>
              <CardDescription>Hay un turno actualmente en curso.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-blue-100">
                  <div>
                    <p className="text-xs text-neutral-500 font-semibold mb-1">Caja</p>
                    <p className="font-medium">{cajas.find(c => c.id === activeShift.cajaId)?.name || 'Caja General'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-semibold mb-1">Abierto por</p>
                    <p className="font-medium">{activeShift.openedByName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-semibold mb-1">Hora de Apertura</p>
                    <p className="font-medium">{new Date(activeShift.startTime).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-semibold mb-1">Fondo Inicial</p>
                    <p className="font-medium">${activeShift.openingBalance.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 font-semibold mb-1">Ventas/Ingresos (Efvo.)</p>
                    <p className="font-medium text-emerald-600">+ ${activeShiftCashPayments.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-semibold mb-1">Efectivo Esperado</p>
                    <p className="font-bold text-blue-700">${expectedClosingBalance.toLocaleString()}</p>
                  </div>
                </div>

                <form onSubmit={handleCloseShift} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-blue-900 font-bold">Efectivo Real en Caja (Para Cuadre)</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={closingBalanceActual} 
                      onChange={e => setClosingBalanceActual(e.target.value)}
                      required 
                      className="text-lg bg-white"
                      placeholder="Ej. 15000"
                    />
                  </div>
                  <Button type="submit" variant="destructive" className="w-full flex items-center gap-2">
                    <StopCircle className="h-4 w-4" />
                    Cerrar Turno y Cuadrar
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Abrir Nuevo Turno
              </CardTitle>
              <CardDescription>Inicie un turno indicando la caja y el fondo inicial de efectivo.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOpenShift} className="space-y-4">
                <div className="space-y-2">
                  <Label>Caja a Operar *</Label>
                  <Select value={selectedCajaId} onValueChange={setSelectedCajaId}>
                    <SelectTrigger>
                      {selectedCajaId ? (
                        <span className="flex flex-1 text-left line-clamp-1">
                          {cajas.find(c => c.id === selectedCajaId)?.name || selectedCajaId}
                        </span>
                      ) : (
                        <SelectValue placeholder="Seleccionar Caja Física" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {cajas.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vendedor Asignado *</Label>
                  <Select value={selectedShiftSellerId} onValueChange={setSelectedShiftSellerId}>
                    <SelectTrigger>
                      {selectedShiftSellerId ? (
                        <span className="flex flex-1 text-left line-clamp-1">
                          {selectedSellerName || selectedShiftSellerId}
                        </span>
                      ) : (
                        <SelectValue placeholder="Seleccionar Vendedor" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {displaySellers.map(seller => (
                        <SelectItem key={seller.id} value={seller.id}>{seller.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fondo Inicial (Menudo / Caja Chica) *</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={openingBalance} 
                    onChange={e => setOpeningBalance(e.target.value)}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Abrir Turno
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Turnos</CardTitle>
        </CardHeader>
        <CardContent>
          {shifts.length === 0 ? (
            <div className="text-center py-10 text-neutral-500">
              <Clock className="mx-auto h-12 w-12 text-neutral-300 mb-2" />
              <p>No hay registro de turnos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estado</TableHead>
                    <TableHead>Apertura</TableHead>
                    <TableHead>Cierre</TableHead>
                    <TableHead>Vendedor (Abre)</TableHead>
                    <TableHead className="text-right">Fondo Inicial</TableHead>
                    <TableHead className="text-right">Ingresos (Efvo)</TableHead>
                    <TableHead className="text-right">Esperado</TableHead>
                    <TableHead className="text-right">Real</TableHead>
                    <TableHead className="text-right">Descuadre</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map(sh => (
                    <TableRow key={sh.id}>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${sh.status === 'Abierto' ? 'bg-blue-100 text-blue-800' : 'bg-neutral-100 text-neutral-800'}`}>
                          {sh.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">{new Date(sh.startTime).toLocaleString()}</TableCell>
                      <TableCell className="text-xs">{sh.endTime ? new Date(sh.endTime).toLocaleString() : '-'}</TableCell>
                      <TableCell>{sh.openedByName}</TableCell>
                      <TableCell className="text-right">${sh.openingBalance.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">
                        {sh.closingBalanceExpected !== undefined ? `$${(sh.closingBalanceExpected - sh.openingBalance).toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {sh.closingBalanceExpected !== undefined ? `$${sh.closingBalanceExpected.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {sh.closingBalanceActual !== undefined ? `$${sh.closingBalanceActual.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {sh.discrepancy !== undefined ? (
                          <span className={`flex items-center justify-end gap-1 ${sh.discrepancy === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {sh.discrepancy === 0 ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            ${sh.discrepancy.toLocaleString()}
                          </span>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
