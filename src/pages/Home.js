import { useState } from 'react';
// material
import { Container, Typography, Breadcrumbs } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductList } from '../sections/@dashboard/products';
// ----------------------------------------------------------------------

export default function Home() {
  return (
    <Page title="Trang chủ">
      <Container>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography fontSize={'24px'} color="text.primary">Trang chủ</Typography>
        </Breadcrumbs>
        <Typography>Chào mừng bạn đến với trang quản lý</Typography>
      </Container>
    </Page>
  );
}
