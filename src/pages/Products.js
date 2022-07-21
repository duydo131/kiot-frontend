import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// material
import { Container, Stack, Typography, Button, Breadcrumbs, Link } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductListTable } from '../sections/@dashboard/products';

// mock
import callApiHttp from '../utils/api';
import { actEnableToast } from 'src/actions/index';

// ----------------------------------------------------------------------

export default function Terminals() {
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await callApiHttp({
        url: '/products',
        method: 'GET',
        params: {
          // 'pageSize': 10
        }
      });
      const { results } = res?.data?.data;
      setProducts(results);
    } catch (e) {
      console.log('e', e);
      let err = e?.response?.data?.data;
      let errText = 'Lỗi hệ thống';
      if (typeof err === 'object') {
        errText = '';
        for (let key in err) {
          errText += `${key} : ${err[key]} \n`;
        }
      }
      toast(errText);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Page title="Sản phẩm">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              <Breadcrumbs aria-label="breadcrumb">
                <Typography fontSize={'24px'} color="text.primary">Danh sách sản phẩm</Typography>
              </Breadcrumbs>
            </Typography>
          </Stack>

          <ProductListTable products={products} />
        </Container>
      </Page>
    </>

  );
}
