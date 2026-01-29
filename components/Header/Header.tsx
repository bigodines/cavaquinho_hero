'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  MenuItem,
  Box,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LanguageIcon from '@mui/icons-material/Language';
import React, { useState, useEffect } from 'react';
import ActiveLink from '../ActiveLink';
import { styled } from '@mui/system';
import styles from './Header.module.scss';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderData {
  labelKey: string;
  href: string;
}

import type { Theme } from '@mui/material/styles';

const headersData: HeaderData[] = [
  {
    labelKey: 'header.chords',
    href: '/chords',
  },
  {
    labelKey: 'header.harmonicField',
    href: '/harmonic_field',
  },
  {
    labelKey: 'header.earTraining',
    href: '/ear-training',
  },
  {
    labelKey: 'header.about',
    href: '/about',
  },
];

const Offset = styled('div')(({ theme }: { theme: Theme }) => theme.mixins.toolbar);

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

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

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLocale = event.target.value;
    // Get the current path without locale
    const pathWithoutLocale = pathname ? pathname.replace(`/${locale}`, '') : '';
    // Navigate to the same path with new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const chLogo = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <MusicNoteIcon sx={{ fontSize: 28 }} />
      <Typography variant="h6" component="h1" className={styles.logo}>
        <Link href={`/${locale}`}>Cavaquinho Hero</Link>
      </Typography>
    </Box>
  );

  const languageSelector = (
    <Select
      value={locale}
      onChange={handleLanguageChange}
      variant="outlined"
      size="small"
      startAdornment={<LanguageIcon sx={{ mr: 0.5, fontSize: 20 }} />}
      sx={{
        color: 'white',
        ml: 2,
        minWidth: 80,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.7)',
        },
        '& .MuiSvgIcon-root': {
          color: 'white',
        },
      }}
    >
      <MenuItem value="pt">PT</MenuItem>
      <MenuItem value="en">EN</MenuItem>
    </Select>
  );

  const getMenuButtons = () => {
    return headersData.map(({ labelKey, href }) => {
      const fullHref = `/${locale}${href}`;
      return (
        <ActiveLink key={labelKey} href={fullHref} activeClassName={styles.active}>
          <Button color="inherit" className={styles.menuButton}>
            {t(labelKey)}
          </Button>
        </ActiveLink>
      );
    });
  };

  const getDrawerChoices = () => {
    return headersData.map(({ labelKey, href }) => {
      const fullHref = `/${locale}${href}`;
      return (
        <Link key={labelKey} href={fullHref} passHref legacyBehavior>
          <MenuItem className={styles.menuButton}>{t(labelKey)}</MenuItem>
        </Link>
      );
    });
  };

  const displayDesktop = () => {
    return (
      <Toolbar className={styles.toolbar}>
        {chLogo}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getMenuButtons()}
          {languageSelector}
        </Box>
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
          <div className={styles.drawerContainer}>
            {getDrawerChoices()}
            <Box sx={{ p: 2 }}>
              {languageSelector}
            </Box>
          </div>
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
