import { Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function Account({description, url}){
    const navigate = useNavigate();
    return (
        <Stack direction="row" alignItems="center" spacing={5} mt={5}>
          <Typography width={190}>{description}</Typography>
          <Typography 
            width={150} 
            style={{
              color: 'blue', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={() => navigate(url)}
          >
            Tại đây!
          </Typography>
        </Stack>
    )
}