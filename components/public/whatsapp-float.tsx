"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export function WhatsAppFloat() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = "905322412431";
  const defaultMessage = "Merhaba, bilgi almak istiyorum.";

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="WhatsApp ile iletişime geç"
    >
      <div className="relative">
        {/* Tooltip */}
        <div
          className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          WhatsApp'tan yazın
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-8 border-transparent border-l-slate-900" />
        </div>

        {/* Button */}
        <div className="relative">
          {/* Pulse animation rings */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
          <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-50" />

          {/* Main button */}
          <div className="relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-110">
            <MessageCircle className="h-7 w-7 text-white" fill="currentColor" />
          </div>
        </div>
      </div>
    </a>
  );
}
