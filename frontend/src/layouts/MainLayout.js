import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import MainNavbar from '../components/MainNavbar';

const MainLayout = () => {
  return (
    <>
      <MainNavbar />
      <Box sx={{ position: 'relative', flex: '1' }}>
        <Outlet />
      </Box>
    </>
  );
};

export default MainLayout;
