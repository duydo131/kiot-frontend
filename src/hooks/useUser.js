import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import callApiHttp from './../utils/api';
import { actEnableToast } from './../actions/index';

// ----------------------------------------------------------------------

export default function useUser(dependency = []) {
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const [account, setAccount] = useState();

  const getCurrentUser = async () => {
    try {
      const res = await callApiHttp({
        url: '/users/me',
        method: 'GET',
      });
      const { data } = res?.data;
      setAccount(data);
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
    getCurrentUser();
  }, dependency);

  return {
    account,
  };
}
