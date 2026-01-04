'use client';

import Header from '../../../components/Header/Header';
import React from 'react';
import { Container, Box } from '@mui/material';
import HarmonicField from '../../../components/HarmonicField/HarmonicField';

export default function HarmonicFieldPage() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <HarmonicField />
      </Container>
    </Box>
  );
}
