import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-pink-50 border-pink-200 text-pink-800"
      : "bg-red-50 border-red-200 text-red-800";

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${bgColor} max-w-sm animate-slide-in`}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? "✅" : "❌"}
        <span>{message}</span>
      </div>
    </div>
  );
}
