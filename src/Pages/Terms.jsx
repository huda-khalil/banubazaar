import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back Button */}
      <Link
        to="/home"
        className="text-pink-600 hover:underline inline-block mb-6 text-sm font-medium"
      >
        ← {t("detail.back")}
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {t("terms.title")}
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-4 text-gray-700 leading-relaxed">
        <p>{t("terms.item1")}</p>
        <p>{t("terms.item2")}</p>
        <p>{t("terms.item3")}</p>
        <div>
          <p className="font-semibold text-gray-800 mb-2">
            {t("terms.item4Title")}
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>{t("terms.item4a")}</li>
            <li>{t("terms.item4b")}</li>
            <li>{t("terms.item4c")}</li>
          </ul>
        </div>
        <p>{t("terms.item5")}</p>
        <p className="text-pink-600 font-medium text-center pt-4">
          {t("terms.thanks")}
        </p>
      </div>
    </div>
  );
}
