import React from "react";

export default function BrandName({ className = "", size = "text-base" }) {
  return (
    <span
      className={`
  font-['Playfair_Display'] 
  italic 
  text-pink-600 
  ${size} 
  ${className}
  tracking-wide
  drop-shadow-sm
`}
    >
      BanuBazaar
    </span>
  );
}
