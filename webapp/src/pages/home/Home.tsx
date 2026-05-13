import { Button } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Button>
        <Link
          to="/select_campaign"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Select Campaign
        </Link>
      </Button>
    </>
  );
}
