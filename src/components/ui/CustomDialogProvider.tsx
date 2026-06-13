import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

interface DialogState {
  isOpen: boolean;
  type: 'confirm' | 'alert';
  alertType?: 'error' | 'success' | 'info';
  title: string;
  message: string;
  resolve?: (value: boolean) => void;
}

interface CustomDialogContextType {
  showConfirm: (message: string, title?: string) => Promise<boolean>;
  showAlert: (message: string, type?: 'error' | 'success' | 'info', title?: string) => Promise<void>;
}

const CustomDialogContext = createContext<CustomDialogContextType | undefined>(undefined);

export function CustomDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: ''
  });

  React.useEffect(() => {
    window.alert = (message: any) => {
      showAlert(String(message), 'error');
    };
  }, []);

  const showConfirm = (message: string, title = 'Confirmar acción'): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        resolve
      });
    });
  };

  const showAlert = (message: string, type: 'error' | 'success' | 'info' = 'error', title?: string): Promise<void> => {
    const defaultTitles = {
      error: 'Error',
      success: 'Éxito',
      info: 'Información'
    };
    
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: 'alert',
        alertType: type,
        title: title || defaultTitles[type],
        message,
        resolve: () => resolve()
      });
    });
  };

  const handleClose = (result: boolean) => {
    setDialog(prev => ({ ...prev, isOpen: false }));
    if (dialog.resolve) {
      dialog.resolve(result);
    }
  };

  return (
    <CustomDialogContext.Provider value={{ showConfirm, showAlert }}>
      {children}
      
      {dialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border shadow-lg rounded-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  dialog.type === 'confirm' ? 'bg-primary/10 text-primary' :
                  dialog.alertType === 'error' ? 'bg-destructive/10 text-destructive' :
                  dialog.alertType === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                }`}>
                  {dialog.type === 'confirm' ? <AlertTriangle className="h-6 w-6" /> :
                   dialog.alertType === 'error' ? <AlertTriangle className="h-6 w-6" /> :
                   dialog.alertType === 'success' ? <CheckCircle2 className="h-6 w-6" /> :
                   <Info className="h-6 w-6" />}
                </div>
                
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{dialog.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{dialog.message}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-4 bg-muted/50 border-t">
              {dialog.type === 'confirm' && (
                <button
                  onClick={() => handleClose(false)}
                  className="px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent text-foreground"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={() => handleClose(true)}
                className={`px-4 py-2 text-sm font-medium text-white transition-colors rounded-md shadow-sm ${
                  dialog.type === 'confirm' ? 'bg-destructive hover:bg-destructive/90' :
                  dialog.alertType === 'error' ? 'bg-destructive hover:bg-destructive/90' :
                  'bg-primary hover:bg-primary/90'
                }`}
              >
                {dialog.type === 'confirm' ? 'Confirmar' : 'Entendido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomDialogContext.Provider>
  );
}

export const useCustomDialog = () => {
  const context = useContext(CustomDialogContext);
  if (!context) {
    throw new Error('useCustomDialog must be used within a CustomDialogProvider');
  }
  return context;
};
