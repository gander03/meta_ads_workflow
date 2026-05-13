import React from "react";

interface AdsetContainerProps extends React.PropsWithChildren {
  children?: React.ReactNode;
  adsetName?: string;
}

const AdsetContainer = ({
  children,
  adsetName = "defaultAdsetName",
}: AdsetContainerProps) => {
  return (
    <div
      style={{
        background: "#dddddd",
        borderRadius: "8px",
        padding: "16px",
        margin: "8px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#cccccc",
          borderRadius: "6px",
          padding: "8px",
          marginBottom: "12px",
        }}
      >
        <h2 style={{ margin: 0 }}>{adsetName}</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
};

export default AdsetContainer;
