'use client';

import Header from '../../components/Header/Header';
import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea,
  Grid,
} from '@mui/material';
import Link from 'next/link';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PianoIcon from '@mui/icons-material/Piano';
import { useTranslations, useLocale } from 'next-intl';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <CardActionArea 
        component={Link} 
        href={href}
        sx={{ height: '100%', p: 2 }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Box sx={{ 
            display: 'inline-flex',
            p: 2,
            borderRadius: '50%',
            backgroundColor: 'rgba(233, 69, 96, 0.1)',
            color: 'secondary.main',
            mb: 2,
          }}>
            {icon}
          </Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Home() {
  const t = useTranslations('home');
  const locale = useLocale();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
          color: 'white',
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ 
            display: 'inline-flex',
            p: 2,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            mb: 3,
          }}>
            <MusicNoteIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ fontWeight: 700, mb: 2 }}
          >
            {t('title')}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.9, 
              maxWidth: 600, 
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            {t('subtitle')}
          </Typography>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, flex: 1 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{ fontWeight: 600, mb: 1 }}
        >
          {t('featuresTitle')}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          textAlign="center"
          sx={{ mb: 6, maxWidth: 500, mx: 'auto' }}
        >
          {t('featuresSubtitle')}
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FeatureCard
              icon={<PianoIcon sx={{ fontSize: 32 }} />}
              title={t('chordGenerator.title')}
              description={t('chordGenerator.description')}
              href={`/${locale}/chords`}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FeatureCard
              icon={<LibraryMusicIcon sx={{ fontSize: 32 }} />}
              title={t('harmonicField.title')}
              description={t('harmonicField.description')}
              href={`/${locale}/harmonic_field`}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          textAlign: 'center', 
          borderTop: '1px solid rgba(0,0,0,0.06)',
          backgroundColor: '#f8f9fa',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t('footer')}
        </Typography>
      </Box>
    </Box>
  );
}
