'use client';

import { Modal, Box } from '@mui/material';
import LocationMap from './Map';

export default function LocationModal({ open, onClose, coords }: any) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 600, bgcolor: '#fff', m: '10% auto', p: 2 }}>
        <LocationMap lat={coords.lat} lon={coords.lon} />
      </Box>
    </Modal>
  );
}
