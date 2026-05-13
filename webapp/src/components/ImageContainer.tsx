import React from "react";

interface ImageContainerProps {
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const ImageContainer: React.FC<ImageContainerProps> = ({
  active = false,
  onClick,
  children,
}) => (
  <div
    onClick={onClick}
    style={{
      position: "relative",
      cursor: "pointer",
      display: "inline-block",
      width: 240,
      height: 360,
      padding: 20,
      margin: 5,
    }}
  >
    {children}
    {active && (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(128,128,128,0.4)",
          pointerEvents: "none",
          zIndex: 1,
          borderRadius: 16, // Added rounding
        }}
      />
    )}
  </div>
);

export default ImageContainer;
