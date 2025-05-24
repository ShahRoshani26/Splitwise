import React from 'react';
import { chakra } from '@chakra-ui/react';

const Logo = ({ width = "150px", height = "40px" }) => {
  return (
    <chakra.svg
      width={width}
      height={height}
      viewBox="0 0 300 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Definitions for gradients */}
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1A202C', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#2D3748', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1A202C', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4FD1C5', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#68D5B8', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Main Circle with gradient */}
      <circle cx="25" cy="25" r="20" fill="url(#iconGradient)" />
      
      {/* Split Line */}
      <path
        d="M25 5 L25 45"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        style={{
          filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))"
        }}
      />
      
      {/* Curved Line */}
      <path
        d="M15 15 Q25 35 35 15"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        style={{
          filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))"
        }}
      />

      {/* Text Shadow */}
      <text
        x="60"
        y="35"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="900"
        fill="black"
        style={{
          filter: "blur(4px)",
          opacity: 0.1
        }}
      >
        Splitwise
      </text>

      {/* Main Text */}
      <text
        x="60"
        y="35"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="900"
        fill="url(#textGradient)"
      >
        Splitwise
      </text>
    </chakra.svg>
  );
};

export default Logo; 