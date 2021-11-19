import Header from '../components/Header/Header'
import React from 'react'
import { Container, Grid } from '@mui/material'
import HarmonicField from '../components/HarmonicField'

export default function Tonality() {

    return (
        <div>
            <Header />
            <Container maxWidth="lg" className="container">
                <Grid container spacing={4}>
                    <div className="toolbar">
                        <Grid item xs={12}>
                            <HarmonicField />
                        </Grid>
                    </div>
                </Grid>
            </Container>
        </div>
    )
}
