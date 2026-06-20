const fs = require('fs');
const path = require('path');

const posViewPath = path.join(__dirname, '../src/features/pos/POSView.tsx');
let content = fs.readFileSync(posViewPath, 'utf8');

content = content.replace("import { generateInvoicePDF }", "import { usePOS } from './hooks/usePOS';\nimport { generateInvoicePDF }");

const startMarker = "  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);";
const endMarker = "  if (!activeShift) {";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find markers.");
    process.exit(1);
}

const hookCall = `
  const pos = usePOS({
    products, clients, sellers, ncfSequences, financialAccounts, currentUser,
    createInvoiceOrQuote, payInvoice, warehouses, addClient, templateSettings,
    activeShift, addShift, updateShift, receipts
  });

  const {
    cart, setCart, selectedClientId, setSelectedClientId, selectedSellerId, setSelectedSellerId,
    docType, setDocType, selectedNcfType, setSelectedNcfType, paymentNotes, setPaymentNotes,
    openingBalance, setOpeningBalance, selectedCajaId, setSelectedCajaId,
    showCloseShiftModal, setShowCloseShiftModal, closingBalanceActual, setClosingBalanceActual,
    selectedShiftSellerId, setSelectedShiftSellerId, cajas, displaySellers, selectedShiftSellerName,
    activeShiftCashPayments, expectedClosingBalance, handleOpenShift, handleCloseShift,
    showQuickClient, setShowQuickClient, quickName, setQuickName, quickRnc, setQuickRnc,
    quickType, setQuickType, dgiiSuggestions, setDgiiSuggestions, showDgiiSuggestions, setShowDgiiSuggestions,
    isSearchingDgii, setIsSearchingDgii, dgiiValidation, setDgiiValidation, dgiiError, setDgiiError,
    handleQuickNameChange, handleValidateQuickRnc, handleSaveQuickClient,
    searchTerm, setSearchTerm, filteredProducts, addToCart, updateQuantity, removeFromCart,
    subtotal, tax, total, showCheckoutModal, setShowCheckoutModal, paymentCash, setPaymentCash,
    paymentCard, setPaymentCard, paymentTransfer, setPaymentTransfer, selectedBankAccountId, setSelectedBankAccountId,
    cashReceived, setCashReceived, completedDoc, setCompletedDoc, printSize, setPrintSize,
    handleCheckoutInitiate, handleFinalizeMixedCheckout
  } = pos;

`;

const newContent = content.substring(0, startIndex) + hookCall + content.substring(endIndex);

fs.writeFileSync(posViewPath, newContent);
console.log("POSView refactored successfully.");
