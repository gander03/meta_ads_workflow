import React from "react";

type NextButtonProps = {
  onClick: () => void;
  text: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  disabled?: boolean;
};
const NextButton: React.FC<NextButtonProps> = ({
  onClick,
  text,
  children,
  style,
  disabled = false,
}) => (
  <button type="button" onClick={onClick} style={style} disabled={disabled}>
    {children || text}
  </button>
);

export default NextButton;
