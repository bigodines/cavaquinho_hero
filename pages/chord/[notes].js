import Header from '../../components/Header/Header'
import React, { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import FretboardY from '../../components/FretboardY/FretboardY'
import { Fretboard } from '../../lib/fretboard'
import Chord from '../../components/Chordz/Chord'
import ChordY from '../../components/FretboardY/ChordY'

export default function Chords() {
    const router = useRouter()

    const tunning = ['A', 'D', 'G', 'B', 'D']
    // const tunning = ['D', 'G', 'B', 'D']

    const instrument = {
        strings: tunning.length,
        fretsOnChord: 12,
        name: 'Cavaquinho',
        keys: [],
        tunings: {
            standard: tunning
        }
    }

    const [chords, setChords] = useState([])

    useEffect(() => {
        if (!router.isReady) return
        const { notes } = router.query

        const fb = Fretboard(tunning)

        const variations = fb.Draw(notes.split('-'))
        const c = []

        for (const variation of variations) {
            const chord = {
                frets: variation,
                barres: [],
                fingers: [],
                capo: false
            }
            c.push(chord)
        }

        setChords(c)
    }, [router.query])

    const renderChords = () => {
        const cc = Object.keys(chords).map((key, i) => {
            console.log('chord:', chords[i])
            return (
                <Grid item xs={2} sm={4} md={6} lg={4} key={key}>
                    <Chord key={'chords' + i}
                        chord={chords[i]}
                        instrument={instrument}
                    />
                </Grid>
            )
        })

        // return (<>
        //     <FretboardY numFrets={12} strings={tunning} />
        //     <ChordY chord={[1, 0, 3, 4, 1]} strings={tunning} />
        // </>)
        return (
            <>{cc}</>
        )
    }

    return (
        <>
            <Header />
            <Container maxWidth="lg" className="container">
                <Grid container spacing={4}>
                    <div className="toolbar">
                        <Grid container spacing={2}>
                            { renderChords() }
                        </Grid>
                    </div>
                </Grid>
            </Container>
        </>
    )
}
