import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";
import LanguageToggle from "../Components/LanguageToggle";
import BrandName from "../Components/BrandName";
import heroImage from "../assets/hero-image.png";

export default function Landing() {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, [i18n.language]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white relative">
      {/* Language Toggle - Positioned Dynamically */}
      <div className={`absolute top-4 z-30 ${isRTL ? "left-4" : "right-4"}`}>
        <LanguageToggle />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        {/* Image with Sparkle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center mb-8"
        >
          <div className="relative p-1 rounded-full bg-gradient-to-r from-pink-300 via-gray-300 to-black bg-[length:300%_300%] animate-gradient inline-block">
            <Link to="/home">
              <img
                src={heroImage}
                alt="BanuBazaar"
                className="w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] object-cover rounded-full shadow-xl relative z-10 block mx-auto cursor-pointer hover:opacity-90 transition"
              />
            </Link>

            {/* Sparkle effect */}
            <motion.div
              className="absolute z-20 pointer-events-none"
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1,
              }}
              style={{
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
            >
              <motion.div
                animate={{ scale: [0.5, 1.8, 0.5], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: "-8px",
                  left: "calc(50% - 8px)",
                  right: "calc(50% - 8px)",
                  margin: "0 auto",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(200,200,255,0.8) 40%, rgba(255,255,255,0) 70%)",
                  boxShadow: "0 0 30px 10px rgba(180,180,255,0.7)",
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome with BrandName */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          <span className="block sm:inline">
            <span className="block sm:inline">
              {t("landing.welcomeBefore")}
            </span>
            <BrandName size="text-3xl sm:text-4xl md:text-5xl" />
            <span className="block sm:inline">{t("landing.welcomeAfter")}</span>
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-pink-600 font-semibold mb-2"
        >
          {t("landing.tagline")}
        </motion.p>

        {/* Extra Line 1 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-md md:text-lg text-gray-600 italic mb-1 shine-subtle"
        >
          {t("landing.taglineExtra1")}
        </motion.p>

        {/* Extra Line 2 */}
        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-md md:text-lg text-pink-500 font-medium mb-4"
        >
          {t("landing.taglineExtra2")}
        </motion.p> */}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-gray-600 mb-8"
        >
          {t("landing.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/submit"
              className="bg-pink-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-700 transition shadow-md inline-block"
            >
              {t("landing.startSelling")}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/home"
              className="bg-white text-pink-600 border-2 border-pink-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-50 transition inline-block"
            >
              {t("landing.browseItems")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
