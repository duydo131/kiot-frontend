import { useState } from 'react';

// material
import { Stack, TextField, Button } from '@mui/material';

// ----------------------------------------------------------------------

export default function TerminalFilter({setFilter}) {
  const [name, setName] = useState()
  const [code, setCode] = useState()

  const handleOnClick = () => {
    setFilter({
      'name': name,
      'code': code
    })
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center" mt={5}>
      <TextField size="small" label="Tên gian hàng" value={name} onChange={(e) => setName(e.target.value)}/>

      <TextField size="small" label="Mã gian hàng" value={code} onChange={(e) => setCode(e.target.value)}/>

      <Button variant="contained" mr={5} onClick={handleOnClick}>Tìm kiếm</Button>
    </Stack>
  );
}
