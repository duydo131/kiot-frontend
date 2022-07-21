import * as React from 'react';
import Box from '@mui/material/Box';
import { DEFAULT_IMAGE_PRODUCT, DEFAULT_IMAGE_USER } from './../constants/httpConstants'

export default function Image({link, alt, onClick, isProduct}) {
  const url = link || (isProduct ? DEFAULT_IMAGE_PRODUCT : DEFAULT_IMAGE_USER);
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
      src={url}
      onClick={onClick}
      style={{cursor: 'pointer'}}
    />
  );
}
