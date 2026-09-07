import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 py-4">
          <div>
            <span className="font-medium text-pink-600">🛍️ BanuBazaar</span>
            <span className="mx-2">•</span>
            <span>Kabul's Marketplace for Women</span>
          </div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-pink-600 transition">
              About
            </a>
            <a href="#" className="hover:text-pink-600 transition">
              Contact
            </a>
            <a href="#" className="hover:text-pink-600 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-pink-600 transition">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
