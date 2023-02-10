import { Table, TableBody, TableCell, TableRow, TableHead, Paper, TableContainer, Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

import styles from './HarmonicField.module.scss'

import { MajorDiatonicScale, DominantChord, IIChord, SubV, PrepDim, HarmonicMinorDiatonicScale } from '../../lib/tonality'

export default function HarmonicField() {
    const [note, setNote] = useState('')
    const [showTable, setShowTable] = useState(false)
    const [chords, setChords] = useState([])

    const handleNoteChange = (event) => {
        setNote(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
    }

    useEffect(() => {
        if (!note) return

        // Major Harmonic Field
        if (note.length === 1) {
            const major = MajorDiatonicScale(note)
            if (major?.length !== 7) {
                console.error('invalid scale')
                return
            }
            setChords(major)
            setShowTable(true)
        // Minor Harmonic Fields
        } else if (note[1] === 'm') {
            // deal with minor chords
            const harmonicMinor = HarmonicMinorDiatonicScale(note)
            setChords(harmonicMinor)
            setShowTable(true)
        }
    }, [note])

    return (
        <div>
            <form noValidate autoComplete="off" onSubmit={handleSubmit} className={styles.noteForm}>
                <TextField id="outlined-basic" label="Nota fundamental" variant="standard" name="rootNote" onChange={handleNoteChange} />
                <Button type="submit" variant="contained">OK</Button>
            </form>
            { showTable && <TableContainer component={Paper}>
                <Table className={styles.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Escala Maior</TableCell>
                            <TableCell align="center">I</TableCell>
                            <TableCell align="center">II</TableCell>
                            <TableCell align="center">III</TableCell>
                            <TableCell align="center">IV</TableCell>
                            <TableCell align="center">V</TableCell>
                            <TableCell align="center">VI</TableCell>
                            <TableCell align="center">VII</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key="diatonic">
                            <TableCell>Acordes Diatônicos</TableCell>
                            { chords.map((v) => {
                                return (<TableCell align="center" key={v}>{v}</TableCell>)
                            })}
                        </TableRow>
                        <TableRow>
                            <TableCell>Dominantes</TableCell>
                            { chords.map((v) => {
                                const rowid = 'V_' + v
                                if (v.indexOf('m7b5') >= 0) return (<TableCell key={rowid} />)
                                return (<TableCell align="center" key={rowid}>{DominantChord(v)}</TableCell>)
                            })}
                        </TableRow>
                        <TableRow key="II_V">
                            <TableCell>II Cadencial</TableCell>
                            { chords.map((v) => {
                                const rowid = 'II_' + v
                                if (v.indexOf('m7b5') >= 0) return (<TableCell key={rowid} />)
                                return (<TableCell align="center" key={rowid}>{IIChord(v)}</TableCell>)
                            })}
                        </TableRow>
                        <TableRow key="prep_dim">
                            <TableCell>Dim. Preparatório</TableCell>
                            { chords.map((v) => {
                                const rowid = 'dim_' + v
                                if (v.indexOf('m7b5') >= 0) return (<TableCell key={rowid} />)
                                return (<TableCell align="center" key={rowid}>{PrepDim(v)}</TableCell>)
                            })}
                        </TableRow>
                        <TableRow key="subV">
                            <TableCell>SubV</TableCell>
                            { chords.map((v) => {
                                const rowid = 'subV' + v
                                if (v.indexOf('m7b5') >= 0) return (<TableCell key={rowid} />)
                                return (<TableCell align="center" key={rowid}>{SubV(v)}</TableCell>)
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>}
        </div>
    )
}
