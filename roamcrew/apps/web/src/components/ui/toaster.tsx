"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      style={{ zIndex: 999999 }}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#0C4A6E] group-[.toaster]:border-white/50 group-[.toaster]:shadow-lg backdrop-blur-md rounded-2xl p-4 font-medium",
          description: "group-[.toast]:text-[#486581]",
          actionButton:
            "group-[.toast]:bg-[#0EA5E9] group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-[#486581] group-[.toast]:rounded-lg",
          success: "group-[.toaster]:!bg-[#ECFDF5] group-[.toaster]:!border-[#10B981]/20 group-[.toaster]:!text-[#065F46]",
          error: "group-[.toaster]:!bg-[#FEF2F2] group-[.toaster]:!border-[#EF4444]/20 group-[.toaster]:!text-[#991B1B]",
        },
      }}
    />
  );
}
