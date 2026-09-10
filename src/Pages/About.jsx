import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function About() {
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
        {t("about.title")}
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6 text-gray-700 leading-relaxed">
        <p>{t("about.intro")}</p>
        <p>{t("about.mission")}</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>{t("about.point1")}</li>
          <li>{t("about.point2")}</li>
          <li>{t("about.point3")}</li>
        </ul>
        <p>{t("about.disclaimer")}</p>
        <p className="text-pink-600 font-medium text-center">
          {t("about.thanks")}
        </p>
      </div>
    </div>
  );
}
