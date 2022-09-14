import React, { useEffect, useState } from 'react';
import Page from '../components/page';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip
} from '@mui/material';
import { useSnackbar } from 'notistack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/system';
import { useAppState } from 'state';

const Home = () => {
  const [balance, setBalance] = useState('0');
  const { active, withdrawBalance } = useAppState();
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      const res = await fetch(
        'https://xdc.blocksscan.io/api/accounts/xdcefD0d0cC73EE70A714c9E681882c1F342fFe7778'
        // 'https://apothem.blocksscan.io/api/accounts/xdc1BD72127e921534943e97A6ca32db0bCE490B0c3'
      );
      const data = await res.json();
      console.log('data', data.balanceNumber);
      setBalance(data.balanceNumber);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [balance]);

  return (
    <Page title="Admin Dashboard | Comtech Gold">
      <Container>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 4 }}>
          GoDOMAINS Admin Dashboard
        </Typography>
        <Accordion
          defaultExpanded
          sx={{
            boxShadow: 'none',
            border: '1px solid #D2D2D2',
            borderRadius: '6px',
            px: 4,
            py: 1,
            mt: '29px'
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              sx={{
                fontSize: '1.125rem',
                fontWeight: 'bold'
              }}
            >
              XDCs Withdraw
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                mb: 2
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  mt: 1,
                  mr: 1
                }}
              >
                Balance:
              </Typography>
              <Chip
                label={active ? `${balance} XDCs` : 'Please connect your wallet'}
                color="success"
                sx={{
                  height: '2.6rem',
                  borderRadius: '1rem',
                  px: 0.5,
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={async () => {
                if (active) {
                  try {
                    await withdrawBalance();
                  } catch (error) {
                    console.log('error', error.message);
                    enqueueSnackbar(error, { variant: 'error' });
                  }
                } else {
                  enqueueSnackbar('Please connect your wallet', { variant: 'info' });
                }
              }}
            >
              Withdraw
            </Button>
          </AccordionDetails>
        </Accordion>
      </Container>
    </Page>
  );
};

export default Home;
