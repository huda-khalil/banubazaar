import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>
            <span className="font-medium text-pink-600">🛍️ BanuBazaar</span>
            <span className="mx-2">•</span>
            <span>{t("landing.subtitle")}</span>
          </div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link to="/about" className="hover:text-pink-600 transition">
              {t("footer.about")}
            </Link>
            <Link to="/contact" className="hover:text-pink-600 transition">
              {t("footer.contact")}
            </Link>
            <Link to="/terms" className="hover:text-pink-600 transition">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
