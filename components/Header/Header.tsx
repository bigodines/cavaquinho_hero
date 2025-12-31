import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  MenuItem,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import React, { useState, useEffect } from 'react';
import ActiveLink from '../ActiveLink';
import { styled } from '@mui/system';
import styles from './Header.module.scss';
import Link from 'next/link';

interface HeaderData {
  label: string;
  href: string;
}

import type { Theme } from '@mui/material/styles';

const headersData: HeaderData[] = [
  {
    label: 'Acordes',
    href: '/chords',
  },
  {
    label: 'Campo Harmônico',
    href: '/harmonic_field',
  },
  {
    label: 'Sobre',
    href: '/about',
  },
];

const Offset = styled('div')(({ theme }: { theme: Theme }) => theme.mixins.toolbar);

export default function Header() {
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    const handleResize = () => setResponsiveness();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const chLogo = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <MusicNoteIcon sx={{ fontSize: 28 }} />
      <Typography variant="h6" component="h1" className={styles.logo}>
        <Link href="/">Cavaquinho Hero</Link>
      </Typography>
    </Box>
  );

  const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
      return (
        <ActiveLink key={label} href={href} activeClassName={styles.active}>
          <Button color="inherit" className={styles.menuButton}>
            {label}
          </Button>
        </ActiveLink>
      );
    });
  };

  const getDrawerChoices = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Link key={label} href={href} passHref legacyBehavior>
          <MenuItem className={styles.menuButton}>{label}</MenuItem>
        </Link>
      );
    });
  };

  const displayDesktop = () => {
    return (
      <Toolbar className={styles.toolbar}>
        {chLogo}
        <div>{getMenuButtons()}</div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          aria-haspopup="true"
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>

        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
          <div className={styles.drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>

        <div>{chLogo}</div>
      </Toolbar>
    );
  };

  return (
    <header>
      <AppBar className={styles.header}>
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
      <Offset />
    </header>
  );
}
