import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/hero-image.png";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        {/* Image with Orbiting Sparkle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center mb-8"
        >
          {/* Circular Border with Shimmer */}
          <div className="relative p-1 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-white-300 bg-[length:300%_300%] animate-gradient inline-block">
            {/* Circular Image */}
            <Link to="/home">
              <img
                src={heroImage}
                alt="BanuBazaar - Click to browse items"
                className="w-[28rem] h-[28rem] md:w-[28rem] md:h-[28rem] object-cover rounded-full shadow-xl relative z-10 block cursor-pointer hover:opacity-90 transition"
              />
            </Link>

            {/* 💎 SILVER ORBITING SPARKLE 💎 */}
            <motion.div
              className="absolute z-20 pointer-events-none"
              animate={{
                rotate: [0, 360],
              }}
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
              {/* The Sparkle Dot */}
              <motion.div
                animate={{
                  scale: [0.5, 1.8, 0.5],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: "-8px",
                  left: "calc(50% - 8px)",
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

        {/* Welcome Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          Welcome to BanuBazaar
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-pink-600 font-semibold mb-2"
        >
          Sell what you don't need. Buy what you LOVE!
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-gray-600 mb-8"
        >
          🌸 Kabul's Marketplace for Women
        </motion.p>

        {/* Buttons */}
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
              Start Selling
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/home"
              className="bg-white text-pink-600 border-2 border-pink-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-50 transition inline-block"
            >
              Browse Items
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
