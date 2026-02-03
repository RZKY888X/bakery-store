"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, X, ShoppingBag } from "lucide-react";

interface Toast {
  id: number;
  message: string;
  productName?: string;
  productImage?: string;
}

interface ToastContextType {
  showToast: (message: string, productName?: string, productImage?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, productName?: string, productImage?: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, productName, productImage }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-in slide-in-from-right fade-in duration-300 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 min-w-[320px] max-w-[400px] flex items-start gap-4"
          >
            {/* Icon or Product Image */}
            {toast.productImage ? (
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <img src={toast.productImage} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag size={14} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Ditambahkan</span>
              </div>
              {toast.productName && (
                <p className="font-bold text-gray-900 truncate">{toast.productName}</p>
              )}
              <p className="text-sm text-gray-500">{toast.message}</p>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
