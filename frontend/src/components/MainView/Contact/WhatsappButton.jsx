import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export const WhatsAppButton = ({ phoneNumber }) => {
  return (
    <Tooltip title="Enviar WhatsApp">
      <IconButton
        component="a"
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
      >
        <WhatsAppIcon color="primary" fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};
