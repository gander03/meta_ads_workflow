import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ListItemText,
  Checkbox,
  MenuItem,
} from "@mui/material";

interface CreateAdSetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  cookieData?: any;
  setCookie?: (data: any) => void;
  timezone: string;
}

const countryOptions = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "IE", name: "Ireland" },
];

const CreateAdSetModal: React.FC<CreateAdSetModalProps> = ({
  open,
  onClose,
  onSubmit,
  cookieData,
  setCookie,
  timezone,
}) => {
  const [form, setForm] = useState<{
    name: string;
    start_time: string;
    end_time?: string;
    countries: string[];
    num_adsets?: number;
    daily_min_spend?: number;
  }>({
    name: "",
    start_time: "",
    end_time: "",
    countries: [],
    num_adsets: 1,
    daily_min_spend: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountriesChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setForm({ ...form, countries: event.target.value as string[] });
  };

  const handleSubmit = () => {
    const data = { ...form };
    if (!data.end_time) {
      delete data.end_time;
    }
    // @ts-ignore
    onSubmit(data);
    setForm({ name: "", start_time: "", end_time: "", countries: [], num_adsets: 1, daily_min_spend: 0 });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Ad Set</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          name="name"
          fullWidth
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label={`Start Time (${timezone})`}
          name="start_time"
          type="datetime-local"
          fullWidth
          value={form.start_time}
          onChange={handleChange}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          margin="dense"
          label={`End Time (${timezone}) - optional`}
          name="end_time"
          type="datetime-local"
          fullWidth
          value={form.end_time}
          onChange={handleChange}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: form.end_time ? (
                <Button
                  size="small"
                  onClick={() => setForm({ ...form, end_time: "" })}
                  style={{ minWidth: 0, padding: 4 }}
                >
                  Clear
                </Button>
              ) : null,
            },
          }}
        />
        <TextField
          select
          slotProps={{
            select: {
              multiple: true,
              renderValue: (selected: unknown) =>
                (selected as string[]).join(", "),
            },
          }}
          margin="dense"
          label="Countries"
          name="countries"
          fullWidth
          value={form.countries}
          onChange={handleCountriesChange}
        >
          {countryOptions.map((country) => (
            <MenuItem key={country.code} value={country.code}>
              <Checkbox checked={form.countries.indexOf(country.code) > -1} />
              <ListItemText primary={country.name} />
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Number of Ad Sets"
          name="num_adsets"
          type="number"
          fullWidth
          inputProps={{ min: 1 }}
          value={(form as any).num_adsets ?? 1}
          onChange={(e) =>
            setForm({
              ...form,
              num_adsets: Math.max(1, Number(e.target.value)),
            })
          }
        />
        <TextField
          margin="dense"
          label="Daily Minimum Spend (optional)"
          name="daily_min_spend"
          fullWidth
          value={form.daily_min_spend}
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
                  name: cookieData.name || "",
                  start_time: cookieData.start_time || "",
                  end_time: cookieData.end_time || "",
                  countries: cookieData.countries || [],
                  num_adsets: cookieData.num_adsets || 1,
                  daily_min_spend: cookieData.daily_min_spend || 0,
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

export default CreateAdSetModal;
