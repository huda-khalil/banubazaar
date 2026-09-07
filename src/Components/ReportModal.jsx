import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";

const REPORT_REASONS = [
  "fake",
  "scam",
  "inappropriate",
  "already_sold",
  "other",
];

export default function ReportModal({ listingId, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      setError("Please select a reason");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { error } = await supabase.from("reports").insert([
        {
          listing_id: listingId,
          reason: reason,
          reporter_phone: contact || null,
          status: "pending",
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err) {
      setError(t("report.error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-green-700">
            {t("report.success")}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {t("report.title")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("report.reason")} *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              required
            >
              <option value="">Select a reason...</option>
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {t(`report.options.${r}`)}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("report.contactOptional")}
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={t("report.contactPlaceholder")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div> */}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {t("report.cancel")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {submitting ? "..." : t("report.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
