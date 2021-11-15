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
import { makeStyles } from '@mui/styles'
import MenuIcon from '@mui/icons-material/Menu'
import React, { useState, useEffect } from 'react'
import ActiveLink from './ActiveLink'
import { styled } from '@mui/system'

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

const useStyles = makeStyles(() => ({
    hh: {
        backgroundColor: '#400CCC',
        paddingRight: '79px',
        paddingLeft: '118px',
        '@media (max-width: 900px)': {
            paddingLeft: 10
        }
    },
    logo: {
        fontFamily: 'Work Sans, sans-serif',
        fontWeight: 600,
        color: '#FFFEFE',
        textAlign: 'left'
    },
    menuButton: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 700,
        size: '18px',
        marginLeft: '38px'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    drawerContainer: {
        padding: '20px 30px'
    }
}))

export default function Header() {
    const { hh, logo, menuButton, toolbar, drawerContainer } = useStyles()

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
            <Toolbar className={toolbar}>
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
                    <div className={drawerContainer}>{getDrawerChoices()}</div>
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
        <Typography variant="h6" component="h1" className={logo}>
        Cavaquinho Hero
        </Typography>
    )

    const getMenuButtons = () => {
        return headersData.map(({ label, href }) => {
            return (
                <ActiveLink href={href}
                    key={label}
                    activeClassName="active"
                    className={menuButton}>
                    <dv>{label}</dv>
                </ActiveLink>
            )
        })
    }

    return (
        <React.Fragment>
            <AppBar position="sticky">
                {mobileView ? displayMobile() : displayDesktop()}
            </AppBar>
        </React.Fragment>
    )
}
