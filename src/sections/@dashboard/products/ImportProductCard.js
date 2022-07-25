import * as Yup from 'yup';
import axios from 'axios'
import { useState, useEffect } from 'react';
import download from 'downloadjs'
import { useDispatch } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';

// material
import { Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import callApiHttp from '../../../utils/api';
import { actEnableToast } from '../../../actions/index';
import LoadImage from '../../../components/LoadImage';

import Label from 'src/components/Label';


// ----------------------------------------------------------------------

const getToken = () => {
  const token = localStorage.getItem('token') || '"no-token"'
  return token.substring(1, token.length - 1)
}

export default function ImportProductCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState(false)

  // const fetchTerminalDetail = async (id) => {
  //   return await callApiHttp({
  //     url: `/terminals/${id}`,
  //     method: 'GET',
  //   });
  // };

  const downloadTemplateFile = async () => {
    axios.create({
      baseURL: 'http://localhost:8000',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
    },
    }).get(
      `product-sample-file`,
      {
        responseType: 'blob',
      },
    )
    .then(res =>
      download(
        res.request.response,
        'Template_Import_Product.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ),
    ).catch(e => console.log("error", e))
  };

  const importProduct = async (values) => {
    try{
      let upload = null
      if (selectedFile === undefined){
        toast('Chưa chọn file import')
        return
      }
      const formData = new FormData();
      formData.append('file', selectedFile);
      upload  = await callApiHttp({
        baseUrl: 'http://localhost:8080',
        url: '/upload',
        method: 'POST',
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log('upload', upload);

      var payload = {
        file_url: upload?.data?.filepath
      };
      const res  = await callApiHttp({
        url: '/products/import',
        method: 'POST',
        data: payload,
      });
      const { data } = res?.data;
      console.log('data', data);
      navigate(`/dashboard/import-product/history`, { replace: true });
    }catch(e){
      console.log('e', e);
      let err = e?.response?.data?.data;
      let errText = 'Thêm sản phẩm thất bại';
      if (typeof err === 'object') {
        errText = '';
        for (let key in err) {
          errText += `${key} : ${err[key]} \n`;
        }
      }
      toast(errText);
      setLoading(false)
      // navigate('/dashboard/products/create', { replace: true });
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" mt={10}>
      <Stack spacing={6} alignItems="center">
        <Stack direction="row" alignItems="center" spacing={5}>
          <Typography variant="h6" width={150}>
            Chọn file import
          </Typography>
          <LoadImage 
            selectedFile={selectedFile} 
            setSelectedFile={setSelectedFile} 
            show={false}
            style={{ marginRight: '5%' }} 
          />
          <LoadingButton size="medium" variant="contained" loading={loading} onClick={importProduct}>
            Import
          </LoadingButton>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={5}>
          <Typography width={190} style={{color: 'red'}}>Bạn đã có file mẫu chưa?</Typography>
          <Typography 
            width={150} 
            style={{
              color: 'blue', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={downloadTemplateFile}
          >
            Tải tại đây!
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
