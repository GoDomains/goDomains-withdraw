import { AppBar, Box, Container } from '@mui/material';
import logo from 'assets/images/logo.png';
import WalletNavbar from './WalletNavbar';

const MainNavbar = () => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#111',
        height: '3.8rem',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <Container
        sx={{
          backgroundColor: 'inherit',
          height: '3.8rem',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        {/* <Toolbar> */}
        <Box component="img" src={logo} sx={{ height: '2.6rem' }} alt="GoDOMAINS" />

        <Box sx={{ flexGrow: 1.2 }} />

        <WalletNavbar />
      </Container>
    </AppBar>
  );
};

export default MainNavbar;
