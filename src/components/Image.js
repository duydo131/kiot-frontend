import * as React from 'react';
import Box from '@mui/material/Box';
import { DEFAULT_IMAGE_PRODUCT } from './../constants/httpConstants'

export default function Image({link, alt}) {
  return (
    <Box
      component="img"
      sx={{
        height: 233,
        width: 350,
        maxHeight: { xs: 350, md: 267 },
        maxWidth: { xs: 350, md: 250 },
      }}
      alt={alt || ''}
      src={link || DEFAULT_IMAGE_PRODUCT}
    />
  );
}
