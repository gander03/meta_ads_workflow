import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import SelectImages from "./pages/select_images/SelectImages";
import SelectCampaign from "./pages/select_campaign/SelectCampaign";
import Campaign from "./pages/campaign/Campaign";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/select_campaign" replace />} />
        <Route path="/campaign/:campaignName" element={<Campaign />} />
        <Route path="/select_images/:campaignName" element={<SelectImages />} />
        <Route path="/select_campaign" element={<SelectCampaign />} />
      </Routes>
    </>
  );
}

export default App;
