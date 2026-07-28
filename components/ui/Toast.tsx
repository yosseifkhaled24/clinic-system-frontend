"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  type = "success",
  duration = 4000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto-close
    const closeTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const styles =
    type === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : "border-red-200 bg-red-50 text-red-800";

  const Icon = type === "success" ? CheckCircle : XCircle;

  return (
    <div
      className={`fixed bottom-6 right-4 z-[9999] max-w-[90vw] transform rounded-2xl border px-5 py-4 shadow-xl transition-all duration-300 sm:right-6 sm:max-w-sm ${styles} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon size={20} className="mt-0.5 shrink-0" />
        <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="shrink-0 rounded-full p-0.5 opacity-60 transition hover:opacity-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

/* ── useToast hook ─────────────────────────────────────────────────── */
interface ToastState {
  message: string;
  type: ToastType;
  key: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, key: Date.now() });
  };

  const hideToast = () => setToast(null);

  const ToastElement = toast ? (
    <Toast
      key={toast.key}
      message={toast.message}
      type={toast.type}
      onClose={hideToast}
    />
  ) : null;

  return { showToast, ToastElement };
}
