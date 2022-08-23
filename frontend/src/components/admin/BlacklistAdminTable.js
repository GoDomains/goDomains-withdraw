import React from 'react';
import { LoadingButton } from '@mui/lab';
import { Grid, FormLabel, TextField, Button, MenuItem, Select, FormControl } from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import { toChecksumAddress, xdcToEthAddress } from 'helpers/web3';
import { useSnackbar } from 'notistack';
import { useAppState } from 'state';

const BlacklistAdminTable = () => {
  const { checkBlackList, updateBlackList, web3 } = useAppState();
  const { enqueueSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: {
      blacklist_address: '',
      isBlacklisted: ''
    },

    onSubmit: async (data, { resetForm }) => {
      console.log('data', data);
      try {
        const _addr = toChecksumAddress(xdcToEthAddress(data.blacklist_address));
        const _isBlacklist = data.isBlacklisted;
        const res = await updateBlackList(_addr, _isBlacklist);

        console.log('🚀 ~ file: BlacklistAdminTable.js ~ line 25 ~ res ~ res', res);
        if (res) {
          resetForm();
        }
      } catch (e) {
        console.log(e);
        if (e.message) {
          enqueueSnackbar(e.message, { variant: 'error' });
        }
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <Grid
          container
          spacing={2}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            mt: 2
          }}
        >
          <Grid item lg={5} md={5} xs={12}>
            <FormLabel>Blacklist Address</FormLabel>
            <TextField
              sx={{ mt: 1 }}
              fullWidth
              {...getFieldProps('blacklist_address')}
              size="small"
              autoComplete="off"
              type="text"
            />
          </Grid>
          <Grid item lg={5} md={5} xs={12}>
            <FormLabel>Blacklisted</FormLabel>
            <FormControl size="small" variant="outlined" fullWidth sx={{ mt: 1 }}>
              <Select
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                {...getFieldProps('isBlacklisted')}
                id="isBlacklisted"
              >
                <MenuItem value>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>

              {/* <FormHelperText sx={{ color: '#d32f2f' }}>
                {touched.issue_category_id && errors.issue_category_id}
              </FormHelperText> */}
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            width: '100%',
            mt: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
        >
          {/* <Grid item lg={12} md={12} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}> */}
          <Button
            // eslint-disable-next-line
            onClick={async () => {
              try {
                const _address = toChecksumAddress(xdcToEthAddress(values.blacklist_address));
                if (web3.utils.isAddress) {
                  const res = await checkBlackList(_address);
                  console.log('🚀 ~ file: BlacklistAdminTable.js ~ line 74 ~ res ~ res', res);
                  return res;
                } else {
                  enqueueSnackbar('Please enter a valid address', { variant: 'error' });
                }
              } catch (error) {
                enqueueSnackbar('Please enter a valid address', { variant: 'error' });
              }
            }}
            variant="gradient"
            type="submit"
            sx={{ mt: 3, mr: 2, height: '2.6rem', width: '7.813rem' }}
          >
            Check
          </Button>
          <LoadingButton
            loadingPosition="start"
            variant="gradient"
            type="submit"
            sx={{ mt: 3, height: '2.6rem', width: '7.813rem' }}
            loading={isSubmitting}
          >
            Blacklist
          </LoadingButton>
          {/* </Grid> */}
        </Grid>
      </Form>
    </FormikProvider>
  );
};

export default BlacklistAdminTable;
