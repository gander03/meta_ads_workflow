import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageContainer from "../../components/ImageContainer";
import NextButton from "../../components/NextButton";
import CreateAdModal from "./CreateAdModal";
import AdsetContainer from "../../components/AdsetContainer";
import Header from "../../components/Header";
import { useCookies } from "react-cookie";
import NotificationSnackbar from "../../components/NotificationSnackbar";
import PageContainer from "../../components/PageContainer";

function jsonifyPath(paths: string[]): any {
  const dict: { [key: string]: { path: string; selected: boolean }[] } = {};
  paths.forEach((path) => {
    const splitPath = path.split("/");
    if (dict[splitPath[1]] === undefined) {
      dict[splitPath[1]] = [];
    }
    dict[splitPath[1]].push({ path: path, selected: false });
  });

  return dict;
}

function urlFromPath(path: string): string {
  return `http://localhost:5757/get_image/${path}`;
}

function adsetNameToDisplayName(adsetName: string): string {
  const parts = adsetName.split("_");
  parts.pop();
  return parts.join(" ").replace(/\b\w/g, (c) => c);
}

export default function SelectImages() {
  const { campaignName } = useParams();

  const [counter, setCounter] = useState(0)
  const [data, setData] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [urlDict, setUrlDict] = useState<{
    [key: string]: { path: string; selected: boolean }[];
  }>({});
  const [cookies, setCookie, removeCookie] = useCookies(["form_ad"]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] =
    useState<string>("default message");

  const searchParams = new URLSearchParams(window.location.search);

  const name = searchParams.get("name");

  const handleSetCookie = (data: any) => {
    setCookie("form_ad", data, { path: "/" });
  };

  const cookieData = cookies.form_ad || {};

  function displaySnackbar(message: string) {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }

  function onFormSubmit(data: any) {
    const path_list = Object.values(urlDict)
      .flat()
      .filter((img) => img.selected)
      .map((img) => img.path);
    displaySnackbar("Processing...");
    fetch("http://localhost:5757/create_ad", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        selectedImages: path_list,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        displaySnackbar(response.message);
      })
      .catch((error) => {
        console.error("Error creating ad:", error);
      });
  }

  function onSubmitFlexible(data: any) {
    const path_list = Object.values(urlDict)
      .flat()
      .filter((img) => img.selected)
      .map((img) => img.path);

    if (path_list.length > 0) {
      const adsetNames = path_list.map((p) => p.split("/")[1]);
      const firstAdset = adsetNames[0];
      const allSame = adsetNames.every((name) => name === firstAdset);
      if (!allSame) {
        displaySnackbar("Please select images from the same ad set.");  
        return;
      }
    }

    displaySnackbar("Processing...");
    fetch("http://localhost:5757/create_flexible", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,

        selectedImages: path_list,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        displaySnackbar(response.message);
        setCounter(counter + 1)
      })
      .catch((error) => {
        console.error("Error creating ad:", error);
      });
  }

  useEffect(() => {
    fetch(`http://localhost:5757/get_image_paths/` + String(campaignName))
      .then((res) => res.text())
      .then((body) => {
        setData(body);
      });
  }, [counter]);

  useEffect(() => {
    if (data) {
      const parsed = JSON.parse(data);
      const paths = parsed.filepaths || [];

      const urls = jsonifyPath(paths);
      setUrlDict(urls);
    }
  }, [data]);

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <PageContainer>
      <Header title={`Select Images`} subtitle={`Campaign: ${name}`}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            float: "right",
          }}
        >
          <NextButton
            onClick={() => setShowForm(true)}
            text={`Create ${
              Object.values(urlDict)
                .flat()
                .filter((img) => img.selected).length
            } Ad${
              Object.values(urlDict)
                .flat()
                .filter((img) => img.selected).length == 1
                ? ""
                : "s"
            }`}
            style={{
              fontSize: 28,
              padding: "24px 36px",
              width: "auto",
              height: "auto",
              minWidth: 120,
              minHeight: 60,
            }}
            disabled={
              Object.values(urlDict)
                .flat()
                .filter((img) => img.selected).length === 0
            }
          />
        </div>
      </Header>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          padding: "16px",
          width: "100%",
          alignItems: "flex-start",
          // Add margin to prevent overlap with header dynamically
          marginTop: document.querySelector("header")?.offsetHeight || 100,
        }}
      >
        {Object.entries(urlDict).map(([adsetName, imagePaths]) => (
          <AdsetContainer
            adsetName={adsetNameToDisplayName(adsetName)}
            key={adsetName}
          >
            {imagePaths.map((path, index) => (
              <ImageContainer
                active={urlDict[adsetName][index].selected}
                key={index}
                onClick={() => {
                  setUrlDict((prev) => {
                    const newDict = { ...prev };
                    newDict[adsetName] = newDict[adsetName].map((item, idx) =>
                      idx === index
                        ? { ...item, selected: !item.selected }
                        : item
                    );
                    return newDict;
                  });
                }}
              >
                <div key={index} style={{ width: "100%", height: "100%" }}>
                  {/\.(mp4|webm|ogg)$/i.test(urlDict[adsetName][index].path) ? (
                    <video
                      src={urlFromPath(
                        encodeURIComponent(urlDict[adsetName][index].path)
                      )}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        pointerEvents: "none",
                        display: "block",
                      }}
                      autoPlay
                      loop
                      muted
                      controls={false}
                    />
                  ) : (
                    <img
                      src={urlFromPath(encodeURIComponent(urlDict[adsetName][index].path))}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                      alt={`Media ${index + 1}`}
                    />
                  )}
                </div>
              </ImageContainer>
            ))}
          </AdsetContainer>
        ))}
      </div>

      <CreateAdModal
        open={showForm}
        onClose={handleCloseForm}
        onSubmit={onFormSubmit}
        onSubmitFlexible={onSubmitFlexible}
        numberOfAds={
          Object.values(urlDict)
            .flat()
            .filter((img) => img.selected).length
        }
        setCookie={handleSetCookie}
        cookieData={cookieData}
      ></CreateAdModal>

      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => {
          setSnackbarOpen(false);
        }}
      />
    </PageContainer>
  );
}
