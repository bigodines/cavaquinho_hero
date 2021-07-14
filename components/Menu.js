import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ActiveLink from './ActiveLink'

export default function Menu() {
    return (
        <div>
            <List>
                <ActiveLink activeClassName="active" href="/">
                    <ListItem button>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                </ActiveLink>
                <ActiveLink activeClassName="active" href="/chords">
                    <ListItem button>
                        <ListItemIcon>
                            <ShoppingCartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Acordes" />
                    </ListItem>
                </ActiveLink>
            </List>

            <Divider />
            <List>
                <ActiveLink activeClassName="active" href="/about">
                    <ListItem button>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="About" />
                    </ListItem>
                </ActiveLink>
            </List>
        </div>
    )
}
