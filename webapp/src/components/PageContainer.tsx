import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => (
  <div
    style={{
      width: "100%",
      height: "100vh",
    }}
  >
    {children}
  </div>
);

export default PageContainer;
