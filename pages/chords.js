import Header from '../components/Header/Header'
import ChordTable from '../components/ChordTable'
import React from 'react'
import { Container, Grid } from '@mui/material'

export default function Chords() {
    return (
        <>
            <Header />
            <Container maxWidth="lg" className="container">
                <Grid container spacing={4}>
                    <div className="toolbar">
                        <Grid item xs={12}>
                            <ChordTable />
                        </Grid>
                    </div>
                </Grid>
            </Container>
        </>
    )
}
