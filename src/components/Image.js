import * as React from 'react';
import Box from '@mui/material/Box';
import { DEFAULT_IMAGE_PRODUCT } from './../constants/httpConstants'

export default function Image({link, alt, onClick}) {
  return (
    <Box
      component="img"
      sx={{
        height: 390,
        width: 300,
        maxHeight: { xs: 390, md: 267 },
        maxWidth: { xs: 350, md: 250 },
      }}
      alt={alt || ''}
      src={link || DEFAULT_IMAGE_PRODUCT}
      onClick={onClick}
      style={{cursor: 'pointer'}}
    />
  );
}
