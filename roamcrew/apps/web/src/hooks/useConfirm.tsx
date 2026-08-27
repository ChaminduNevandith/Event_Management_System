"use client";

import { useState, useCallback } from "react";
import { AlertCircle } from "lucide-react";

export function useConfirm() {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("Confirm Action");

  const confirm = useCallback((msg: string, customTitle?: string) => {
    setMessage(msg);
    if (customTitle) setTitle(customTitle);
    
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });
  }, []);

  const handleConfirm = () => {
    promise?.resolve(true);
    setPromise(null);
  };

  const handleCancel = () => {
    promise?.resolve(false);
    setPromise(null);
  };

  const ConfirmationModal = () => {
    if (!promise) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0C4A6E]/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/80 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-100 text-red-600 p-3 rounded-2xl shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0C4A6E]">{title}</h3>
          </div>
          <p className="text-[#486581] font-medium mb-8 leading-relaxed">
            {message}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl font-bold text-[#486581] bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return { confirm, ConfirmationModal };
}
