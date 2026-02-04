"use client";

import { Button, TextField, Box } from "@mui/material";
import { useState } from "react";
import LocationPickerDialog from "@/app/(DashboardLayout)/components/mapcomponents/LocationPickerDialog";

export default function LocationPage() {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  return (
    <Box p={3}>
   

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => setOpen(true)}
      >
        Get Location
      </Button>

      <LocationPickerDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={(data) => {
          setAddress(data.address);
          setCoords({ lat: data.lat, lon: data.lon });
        }}
      />
    </Box>
  );
}
