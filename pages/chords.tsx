import Header from '../components/Header/Header';
import ChordTable from '../components/ChordTable';
import React from 'react';
import { Container, Box } from '@mui/material';

export default function Chords() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <ChordTable />
      </Container>
    </Box>
  );
}
