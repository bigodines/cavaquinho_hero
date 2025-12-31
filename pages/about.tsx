import React from 'react';
import Header from '../components/Header/Header';
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

export default function About() {
  const features = [
    'Gerar tríades e tétrades para qualquer nota',
    'Explorar campos harmônicos maiores e menores',
    'Aprender sobre progressões e dominantes secundários',
    'Visualizar acordes no braço do cavaquinho',
    'Descobrir substituições como SubV e diminutos preparatórios',
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
            Sobre o Projeto
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 500, mx: 'auto' }}>
            O Cavaquinho Hero é uma ferramenta de teoria musical projetada para 
            ajudar músicos a entender acordes, escalas e campos harmônicos.
          </Typography>
        </Paper>

        {/* Features */}
        <Paper sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Funcionalidades
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
            Tecnologias
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Este projeto foi construído com tecnologias modernas:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['Next.js 15', 'React 18', 'TypeScript', 'Material UI 6', 'Sass'].map((tech) => (
              <Box 
                key={tech}
                sx={{ 
                  px: 2, 
                  py: 1, 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {tech}
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
