'use client';

import React from 'react';
import Header from '../../../components/Header/Header';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('about');
  const features = [
    t('features.0'),
    t('features.1'),
    t('features.2'),
    t('features.3'),
    t('features.4'),
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Hero */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
            borderRadius: 3,
            color: 'white',
          }}
        >
          <Box sx={{ 
            display: 'inline-flex',
            p: 2,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            mb: 2,
          }}>
            <MusicNoteIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {t('title')}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 500, mx: 'auto' }}>
            {t('subtitle')}
          </Typography>
        </Paper>

        {/* Features */}
        <Paper sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            {t('featuresTitle')}
          </Typography>
          <List disablePadding>
            {features.map((feature, index) => (
              <React.Fragment key={feature}>
                <ListItem sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={feature}
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                {index < features.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* Tech Stack */}
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            {t('techTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {t('techDescription')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['https://github.com/bigodines/cavaquinho_hero', 'https://www.imbigo.net'].map((tech) => (
              <a
                key={tech}
                href={tech}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'background 0.2s',
                    '&:hover': {
                      backgroundColor: '#e2e6ea',
                    },
                  }}
                >
                  {tech}
                </Box>
              </a>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
