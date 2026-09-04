import React from "react";
import { Link } from "react-router-dom";
import logo3 from "../assets/logo3.jpg";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b border-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div>
            <h1 className="text-2xl font-bold text-pink-600">BanuBazaar</h1>
            <p className="text-sm text-gray-500 leading-tight">
              Sell what you don't need. Buy what you LOVE!
            </p>
            <p className="text-xs text-pink-400 font-medium mt-0.5">
              🌸 Kabul's Marketplace for Women
            </p>
          </div>
        </Link>
        <img
          src={logo3}
          alt="Girl"
          className="h-24 w-30"
          style={{ marginLeft: "auto" }}
        />

        <nav className="space-x-4">
          <Link
            to="/home"
            className="text-gray-600 hover:text-pink-600 transition"
          >
            Home
          </Link>
          <Link
            to="/submit"
            className="text-pink-600 font-semibold hover:text-pink-700 transition"
          >
            Sell
          </Link>
          <Link
            to="/admin"
            className="text-gray-400 hover:text-pink-600 transition text-sm"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
