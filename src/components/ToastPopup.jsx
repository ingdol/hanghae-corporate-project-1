import React, { useEffect } from "react";
import useToastStore from "@/store/toast/useToastStore";

const ToastPopup = () => {
  const { toast, hideToast } = useToastStore();

  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast.isVisible, hideToast]);

  if (!toast.isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "5rem",
        right: "1rem",
        padding: "1rem",
        background: "rgba(0, 0, 0, 0.7)",
        color: "#fff",
        borderRadius: "5px",
      }}
    >
      {toast.message}
    </div>
  );
};

export default ToastPopup;
