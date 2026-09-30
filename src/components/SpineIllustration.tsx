import React from 'react';

interface SpineIllustrationProps {
  className?: string;
}

export default function SpineIllustration({ className = '' }: SpineIllustrationProps) {
  // 5 đốt sống xen 4 đĩa đệm, đốt to dần từ trên xuống
  // viewBox 0 0 170 230
  // Đốt 1: y=15, w=76, h=26, rx=9
  // Đệm 1: y=45, w=64, h=14, rx=5
  // Đốt 2: y=63, w=84, h=28, rx=9.5
  // Đệm 2: y=95, w=72, h=14, rx=5
  // Đốt 3: y=113, w=94, h=30, rx=10
  // Đệm 3: y=147, w=80, h=14, rx=5
  // Đốt 4: y=165, w=104, h=32, rx=10
  // Đệm 4: y=201, w=88, h=14, rx=5
  // Đốt 5: y=219 (or adjusted to fit in 230)
  return (
    <svg
      viewBox="0 0 170 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Nền cong mờ thẩm mỹ */}
      <circle cx="120" cy="115" r="75" fill="white" fillOpacity="0.3" />

      {/* Đốt 1 */}
      <rect
        x="47"
        y="12"
        width="76"
        height="24"
        rx="9"
        fill="#FFFFFF"
        stroke="#2D5B94"
        strokeWidth="3"
      />
      {/* Đĩa đệm 1 */}
      <rect
        x="53"
        y="40"
        width="64"
        height="13"
        rx="4.5"
        fill="#F2B38A"
        stroke="#B4501F"
        strokeWidth="2"
      />

      {/* Đốt 2 */}
      <rect
        x="43"
        y="57"
        width="84"
        height="26"
        rx="9.5"
        fill="#FFFFFF"
        stroke="#2D5B94"
        strokeWidth="3"
      />
      {/* Đĩa đệm 2 */}
      <rect
        x="49"
        y="87"
        width="72"
        height="13"
        rx="4.5"
        fill="#F2B38A"
        stroke="#B4501F"
        strokeWidth="2"
      />

      {/* Đốt 3 */}
      <rect
        x="38"
        y="104"
        width="94"
        height="28"
        rx="10"
        fill="#FFFFFF"
        stroke="#2D5B94"
        strokeWidth="3"
      />
      {/* Đĩa đệm 3 */}
      <rect
        x="45"
        y="136"
        width="80"
        height="13"
        rx="5"
        fill="#F2B38A"
        stroke="#B4501F"
        strokeWidth="2"
      />

      {/* Đốt 4 */}
      <rect
        x="33"
        y="153"
        width="104"
        height="30"
        rx="10"
        fill="#FFFFFF"
        stroke="#2D5B94"
        strokeWidth="3"
      />
      {/* Đĩa đệm 4 */}
      <rect
        x="41"
        y="187"
        width="88"
        height="13"
        rx="5"
        fill="#F2B38A"
        stroke="#B4501F"
        strokeWidth="2"
      />

      {/* Đốt 5 */}
      <rect
        x="28"
        y="204"
        width="114"
        height="32"
        rx="10"
        fill="#FFFFFF"
        stroke="#2D5B94"
        strokeWidth="3"
      />
    </svg>
  );
}
