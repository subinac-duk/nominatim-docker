"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";

const LocationMap = dynamic(
  () => import("@/app/(DashboardLayout)/components/mapcomponents/LocationMap"),
  { ssr: false }
);

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    lat: number;
    lon: number;
    address: string;
  }) => void;
};

export default function LocationPickerDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
    address: string;
  } | null>(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Location</DialogTitle>

      <DialogContent dividers>
        <LocationMap
          onLocationChange={(data) => setLocation(data)}
        />

        {location && (
          <Typography mt={2} variant="body2">
            <b>Address:</b> {location.address}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button sx={{ visibility: 'hidden' }}
          variant="contained"
          disabled={!location}
          onClick={() => {
            if (location) {
              onConfirm(location);
              onClose();
            }
          }}
        >
          Confirm Location
        </Button>
      </DialogActions>
    </Dialog>
  );
}
