import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  Button,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import CreateAdSetModal from "./CreateAdSetModal";
import { useCookies } from "react-cookie";
import NotificationSnackbar from "../../components/NotificationSnackbar";
import { DateTime } from "luxon";

export default function Campaign() {
  const navigate = useNavigate();
  const { campaignName } = useParams();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(["form"]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] =
    useState<string>("default message");

  const timezone = { zone: "Europe/London", name: "London" };

  const searchParams = new URLSearchParams(window.location.search);

  const name = searchParams.get("name");

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSetCookie = (data: any) => {
    setCookie("form", data, { path: "/" });
  };

  const cookieData = cookies.form || {};

  function displaySnackbar(message: string) {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }

  function setTimeFromZone(time: string) {
    const newTime = DateTime.fromISO(time, {
      zone: timezone.zone,
    });
    return newTime.toUTC().toISO();
  }

  function onFormSubmit(data: any) {
    if (data["start_time"]) {
      data["start_time"] = setTimeFromZone(data["start_time"]);
    }

    displaySnackbar;
    fetch(`http://localhost:5757/create_adset/${campaignName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        displaySnackbar(response.message);
      })
      .catch((error) => {
        console.error("Error creating adset:", error);
      });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        paddingTop: "2%",
        boxSizing: "border-box"
        }}
    >
      <Header title={`Campaign`} subtitle={name} />

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
          marginTop: document.querySelector("header")?.offsetHeight || 173,
          borderRadius: "16px",
        }}
      >
        <Card variant="outlined" style={{ margin: "1%" }}>
          <CardActionArea
            onClick={() =>
              navigate(`/select_images/${campaignName}?name=${name}`)
            }
          >
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                fontFamily="Aevenir, Arial, sans-serif"
              >
                Select Images
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card variant="outlined" style={{ margin: "1%" }}>
          <CardActionArea onClick={() => setShowForm(true)}>
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                fontFamily="Aevenir, Arial, sans-serif"
              >
                Create New Ad Set
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>

      <CreateAdSetModal
        open={showForm}
        onClose={handleCloseForm}
        onSubmit={onFormSubmit}
        cookieData={cookieData}
        setCookie={handleSetCookie}
        timezone={timezone.name}
      ></CreateAdSetModal>

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
