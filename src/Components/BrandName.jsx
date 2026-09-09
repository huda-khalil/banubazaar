import React from "react";

export default function BrandName({ className = "", size = "text-base" }) {
  return (
    <span
      className={`
        font-['Playfair_Display'] 
        italic 
        font-bold
        text-pink-600 
        ${size} 
        ${className}
        tracking-wide
        drop-shadow-sm
        hover:text-pink-700 
        transition-colors 
        duration-200
      `}
    >
      BanuBazaar
    </span>
  );
}

// import React from "react";

// export default function BrandName({ className = "", size = "text-base" }) {
//   return (
//     <span
//       className={`
//         font-['Playfair_Display']
//         italic
//         text-pink-600
//         ${size}
//         ${className}
//         tracking-wide
//         drop-shadow-sm
//         hover:text-pink-700
//         transition-colors
//         duration-200
//       `}
//     >
//       BanuBazaar
//     </span>
//   );
// }

// import React from "react";

// export default function BrandName({ className = "", size = "text-base" }) {
//   return (
//     <span
//       className={`
//   font-['Playfair_Display']
//   italic
//   text-pink-600
//   ${size}
//   ${className}
//   tracking-wide
//   drop-shadow-sm
// `}
//     >
//       BanuBazaar
//     </span>
//   );
// }
