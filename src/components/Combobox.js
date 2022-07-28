import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Combobox({label, items, value, setValue, sx}) {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const rederItems = (items) => {
    return items.map(s => <MenuItem style={{height: "30px"}} key={s.id} value={s.value}>{s.title}</MenuItem>)
  }

  return (
    <Box sx={{ minWidth: 120, ...sx }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
        >
          {rederItems(items)}
        </Select>
      </FormControl>
    </Box>
  );
}