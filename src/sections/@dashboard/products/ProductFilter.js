import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Stack, TextField, Button } from '@mui/material';
import callApiHttp from './../../../utils/api';
import { actEnableToast } from 'src/actions/index';
import Combobox from 'src/components/Combobox';

// ----------------------------------------------------------------------

const active = [
  {
    id: 0,
    value: '',
    title: '',
  },
  {
    id: 1,
    value: true,
    title: 'Đã bán',
  },
  {
    id: 2,
    value: false,
    title: 'Chưa bán',
  },
]

export default function ProductFilter({ setFilter }) {
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const [name, setName] = useState();
  const [sku, setSku] = useState();
  const [terminals, setTerminals] = useState([]);
  const [terminalId, setTerminalId] = useState();
  const [isActive, setIsActive] = useState();

  const handleOnClick = () => {
    setFilter({
      name: name,
      sku: sku,
      terminal_id: terminalId,
      is_active: isActive
    });
  };

  const fetchTerminals = async () => {
    try {
      const res = await callApiHttp({
        url: '/terminals/all',
        method: 'GET',
      });
      const { data } = res?.data;
      let terminalList = [
        {
          id: 0,
          value: '',
          title: '',
        },
      ];

      setTerminals(
        terminalList.concat(
          data.map((item) => {
            return {
              id: item?.id,
              value: item?.id,
              title: item?.name,
            };
          })
        )
      );
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
    fetchTerminals();
  }, []);

  return (
    <Stack direction="row" spacing={2} alignItems="center" mt={5}>
      <TextField size="small" label="Tên sản phẩm" value={name} onChange={(e) => setName(e.target.value)} />

      <TextField size="small" label="Sku sản phẩm" value={sku} onChange={(e) => setSku(e.target.value)} />

      <Combobox label={'Gian hàng'} items={terminals} value={terminalId} setValue={setTerminalId} />

      <Combobox label={'Trạng thái'} items={active} value={isActive} setValue={setIsActive} />

      <Button variant="contained" mr={5} onClick={handleOnClick}>
        Tìm kiếm
      </Button>
    </Stack>
  );
}
