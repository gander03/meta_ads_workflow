import Snackbar from "@mui/material/Snackbar";

export default function NotificationSnackbar({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose?: () => void;
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={20000}
      message={message}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={onClose}
    />
  );
}
