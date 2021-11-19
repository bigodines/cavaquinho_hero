import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    Link,
    MenuItem
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import React, { useState, useEffect } from 'react'
import ActiveLink from '../ActiveLink'
import { styled } from '@mui/system'
import styles from './Header.module.scss'

const headersData = [
    {
        label: 'Acordes',
        href: '/chords'
    },
    {
        label: 'Campo Harmonico',
        href: '/harmonic_field'
    },
    {
        label: 'Sobre',
        href: '/about'
    }
]

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar)

export default function Header() {
    
    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false
    })

    const { mobileView, drawerOpen } = state

    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 900
                ? setState((prevState) => ({ ...prevState, mobileView: true }))
                : setState((prevState) => ({ ...prevState, mobileView: false }))
        }

        setResponsiveness()

        window.addEventListener('resize', () => setResponsiveness())

        return () => {
            window.removeEventListener('resize', () => setResponsiveness())
        }
    }, [])

    const displayDesktop = () => {
        return (
            <Toolbar className={styles.toolbar}>
                {chLogo}
                <div>{getMenuButtons()}</div>
            </Toolbar>
        )
    }

    const displayMobile = () => {
        const handleDrawerOpen = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: true }))
        const handleDrawerClose = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: false }))

        return (
            <Toolbar>
                <IconButton
                    {...{
                        edge: 'start',
                        color: 'inherit',
                        'aria-label': 'menu',
                        'aria-haspopup': 'true',
                        onClick: handleDrawerOpen
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    {...{
                        anchor: 'left',
                        open: drawerOpen,
                        onClose: handleDrawerClose
                    }}
                >
                    <div className={styles.drawerContainer}>{getDrawerChoices()}</div>
                </Drawer>

                <div>{chLogo}</div>
            </Toolbar>
        )
    }

    const getDrawerChoices = () => {
        return headersData.map(({ label, href }) => {
            return (
                <ActiveLink activeClassName="active" href={href} key={label}>
                    <MenuItem>{label}</MenuItem>
                </ActiveLink>
            )
        })
    }

    const chLogo = (
        <Typography variant="h6" component="h1" className={styles.logo}>
        Cavaquinho Hero
        </Typography>
    )

    const getMenuButtons = () => {
        return headersData.map(({ label, href }) => {
            return (
                <ActiveLink href={href}
                    key={label}
                    activeClassName="active"
                    className={styles.menuButton}>
                    <Button variant="outlined" color="secondary">{label}!</Button>
                </ActiveLink>
            )
        })
    }

    return (
        <>
            <AppBar position="sticky" className={styles.hh}>
                {mobileView ? displayMobile() : displayDesktop()}
            </AppBar>
            <Offset />
        </>
    )
}
