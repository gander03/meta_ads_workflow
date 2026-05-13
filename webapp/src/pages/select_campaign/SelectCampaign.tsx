import { use, useEffect, useState } from "react";
import Header from "../../components/Header";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import NotificationSnackbar from "../../components/NotificationSnackbar";

export default function SelectCampaign() {
  const [data, setData] = useState<string>("");
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>(
    []
  );

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] =
    useState<string>("default message");

  useEffect(() => {
    fetch("http://localhost:5757/get_campaigns")
      .then((res) => res.text())
      .then((body) => {
        setData(body);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
      });
  }, []);

  useEffect(() => {
    if (data) {
      const parsed = JSON.parse(data);
      const campaignList = parsed.campaigns || [];
      setCampaigns(campaignList);
    }
  }, [data]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        boxSizing: "border-box",
        padding: "2%"
      }}
    >
      <Header title="Select Campaign" />
      <div
        style={{
          display: "block",
          flexWrap: "wrap",
          gap: "16px",
          background: "#cccccc",
          width: "97vw",
          padding: "2%",
          boxSizing: "border-box",
          alignItems: "flex-start",
          marginTop: document.querySelector("header")?.offsetHeight || 100,
          borderRadius: "16px",
        }}
      >
        {campaigns.map((campaign, index) => (
          <>
            <Card variant="outlined" style={{ margin: "1%" }}>
              <CardActionArea
                href={`/campaign/${campaign.id}?name=${campaign.name}`}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    fontFamily="Aevenir, Arial, sans-serif"
                  >
                    {campaign.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>


          </>
          
          
        ))}
      </div>
      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => {
          setSnackbarOpen(false);
        }}
      />
    </div>
  );
}
