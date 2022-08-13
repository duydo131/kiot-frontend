import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import download from 'downloadjs';

import PropTypes from 'prop-types';
// material
import { Link, Typography } from '@mui/material';
// import ShopProductCard from './ProductCard';
import DataTable from '../../../components/Table';
// ----------------------------------------------------------------------

function formatDate(value) {
  let d = new Date(value);
  return (
    d.getDate() +
    '/' +
    (d.getMonth() + 1) +
    '/' +
    d.getFullYear() +
    ' ' +
    d.getHours() +
    ':' +
    (d.getMinutes() + 1) +
    ':' +
    d.getSeconds()
  );
}

WorkloadHistoryList.propTypes = {
  workloads: PropTypes.array.isRequired,
};

export default function WorkloadHistoryList({ workloads }) {
  function openTab(link) {
    window.open(link);
  }

  const columns = [
    { field: 'email', headerName: 'Email', width: 170, headerAlign: 'center', align: 'center' },
    {
      field: 'source_file',
      headerName: 'File nguồn',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography
          width={190}
          style={{
            color: 'blue',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          onClick={() => openTab(params.row.source_file)}
        >
          Tải tại đây
        </Typography>
      ),
    },
    {
      field: 'quantity_product',
      headerName: 'Số sản phẩm được thêm',
      width: 190,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params.row.quantity_product || 0,
    },

    {
      field: 'created_at',
      headerName: 'Thời gian đăng ký',
      width: 190,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => formatDate(params.row.created_at),
    },
    {
      field: 'result_file',
      headerName: 'File kết quả',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const status = params.row.status;
        const isDone = status === 'SUCCESS' || status === 'FAIL';
        return isDone ? (
          <Typography
            width={190}
            style={{
              color: 'blue',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={() => openTab(params.row.result_file || params.row.source_file)}
          >
            Tải tại đây
          </Typography>
        ) : (
          <Typography width={190}></Typography>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const status = params.row.status;
        const color = status === 'SUCCESS' ? 'blue' : 'red';
        return (
          <Typography width={190} align="center" style={{ color: color }}>
            {status}
          </Typography>
        );
      },
    },
  ];
  return <DataTable rows={workloads} columns={columns} />;
}
