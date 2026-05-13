import React from "react";

interface HeaderProps extends React.PropsWithChildren {
  title: string;
  children?: React.ReactNode;
  subtitle?: string | null;
}

const Header: React.FC<HeaderProps> = ({ title, children, subtitle }) => (
  <header
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      padding: "0% 3% 0% 3%",
      borderBottom: "1px solid #eee",
      display: "flex",
      backgroundColor: "#f0f0f0",
      color: "#333",
      zIndex: 1000,
      justifyContent: "space-between",
      boxSizing: "border-box",
    }}
  >
    <div>
      <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h1 style={{ cursor: "pointer" }}>{title}</h1>
      </a>
      <h3 style={{ fontStyle: "italic", color: "#444444", fontWeight: 600 }}>
        {subtitle}
      </h3>
    </div>
    {children}
  </header>
);

export default Header;
