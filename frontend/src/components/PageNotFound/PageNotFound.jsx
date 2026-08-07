import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function PageNotFound() {

  const { t } = useTranslation('ui');
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <img
              src="/pageNotFound.jpg"
              alt=""
              width={400}
              height={250}
            />
            <Typography variant="h1">
              404
            </Typography>
            <Typography variant="h6">
              {t('notFound')}
            </Typography>
            <br/>
            <Button variant="contained" onClick={() => navigate("/")}>{t('backHome')}</Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
