import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
} from "@mui/material";

interface CreateAdModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  onSubmitFlexible?: (data: FormData) => void;
  numberOfAds: number;
  getImageUrlList?: () => string[];
  cookieData?: any;
  setCookie?: (data: any) => void;
}

interface FormData {
  headline: string;
  primary_text: string;
  description: string;
  link: string;
}

const initialFormState: FormData = {
  headline: "",
  primary_text: "",
  description: "",
  link: "",
};

const CreateAdModal: React.FC<CreateAdModalProps> = ({
  open,
  onClose,
  onSubmit,
  onSubmitFlexible,
  numberOfAds,
  cookieData,
  setCookie,
}) => {
  const [form, setForm] = useState<FormData>(initialFormState);
  const [switchActive, setSwitchActive] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (switchActive && onSubmitFlexible) {
      onSubmitFlexible(form);
    } else if (onSubmit) {
      onSubmit(form);
    } else {
      console.error("No submit handler provided");
      return;
    }

    setForm(initialFormState);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {switchActive
          ? "Create Single Flexible Ad"
          : `Create ${numberOfAds} Ad${numberOfAds !== 1 ? "s" : ""}`}
        <br />
        <i>{switchActive ? `${numberOfAds} items selected` : <></>}</i>
        <span style={{ float: "right" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: "0.85em" }}>Single Flexible Ad</span>
            <Switch
              color="primary"
              checked={switchActive}
              onChange={() => setSwitchActive((prev) => !prev)}
            />
          </label>
        </span>
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Headline"
          name="headline"
          fullWidth
          value={form.headline}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Primary Text"
          name="primary_text"
          fullWidth
          value={form.primary_text}
          onChange={handleChange}
          multiline
          minRows={5}
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          fullWidth
          value={form.description}
          onChange={handleChange}
          multiline
          minRows={3}
        />
        <TextField
          margin="dense"
          label="Link"
          name="link"
          fullWidth
          value={form.link}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <div style={{ marginRight: "auto" }}>
          <Button
            onClick={() => {
              if (typeof setCookie === "function") {
                setCookie(form);
              }
            }}
            color="secondary"
          >
            Set as Default
          </Button>
          <Button
            onClick={() => {
              if (cookieData) {
                setForm({
                  headline: cookieData.headline || "",
                  primary_text: cookieData.primary_text || "",
                  description: cookieData.description || "",
                  link: cookieData.link || "",
                });
              }
            }}
            color="secondary"
          >
            Load Default
          </Button>
        </div>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAdModal;
