"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  className,
  title,
  ariaLabel,
  ariaDescribedBy
}: ModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const trapRef = useFocusTrap(isOpen);

  // Close on Escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 0.95,
      y: shouldReduceMotion ? 0 : 10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: (shouldReduceMotion ? "tween" : "spring") as "tween" | "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    exit: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 0.95,
      y: shouldReduceMotion ? 0 : 10,
      transition: { duration: 0.15 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C4A6E]/60 backdrop-blur-md overflow-y-auto"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
        >
          {/* Invisible overlay click handler */}
          <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
          
          <motion.div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || title}
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={ariaDescribedBy}
            className={cn("relative z-50 w-full bg-white rounded-2xl shadow-xl p-6", className)}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {title && (
              <h2 id="modal-title" className="sr-only">
                {title}
              </h2>
            )}
            
            {/* Standard Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
