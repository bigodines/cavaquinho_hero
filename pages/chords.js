import Header from '../components/Header'
import ChordTable from '../components/ChordTable'
import React from 'react'
import { Container, Grid, makeStyles } from '@mui/material'

const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto'
    },

    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    },

    toolbar: theme.mixins.toolbar

}))

export default function Chords() {
    const classes = useStyles()

    return (
        <div>
            <Header />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={4}>
                    <div className={classes.toolbar}>
                        <Grid item xs={12}>
                            <ChordTable />
                        </Grid>
                    </div>
                </Grid>
            </Container>
        </div>
    )
}
