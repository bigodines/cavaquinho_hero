import { Table, TableBody, TableCell, TableRow, TableHead, Paper, TableContainer, Button, TextField } from '@mui/material'

import { makeStyles } from '@mui/styles'
import { sizeWidth } from '@mui/system'
import Link from 'next/link'
import React, { useState } from 'react'
import * as chords from '../lib/chords'

function generateChords(n) {
    if (!n || n.length < 1) {
        return {}
        // TODO: error
        // return res.render('tetrads', { layout: 'index' })
    }

    n = n[0].toUpperCase() + n.substring(1)

    const ret = {
        '': chords.MajorTriad(n),
        m: chords.MinorTriad(n),
        '+': chords.AugmentedTriad(n),
        '°': chords.DiminishedTriad(n),
        7: chords.SevenTetrad(n),
        '7M': chords.SevenMajorTetrad(n),
        m7: chords.minorSevenTetrad(n),
        'm7+': chords.MinorSevenMajorTetrad(n),
        '7(#5)': chords.AugmentedSeventhTetrad(n),
        '7+(#5)': chords.AugmentedMajorSeventhTetrad(n),
        Ø: chords.HalfDiminishedTetrad(n),
        o: chords.DiminishedTetrad(n),
        '7(b5)': chords.SevenFlatFiveTetrad(n),
        6: chords.SixthTetrad(n),
        m6: chords.MinorSixthTetrad(n)
    }

    return ret
}

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
        width: 1200
    },
    noteForm: {
        textAlign: 'center'
    }
}))

export default function ChordTable() {
    const classes = useStyles()
    const [note, setNote] = useState('')
    const [showTable, setShowTable] = useState(false)
    const [chords, setChords] = useState({})

    const handleNoteChange = (event) => {
        setNote(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const c = generateChords(note)

        setChords(c)
        setShowTable(true)
    }

    const renderChords = () => {
        const cc = Object.keys(chords).map((key, i) => {
            const viz = '/chord/' + Object.values(chords[key]).join('-')

            return (<TableRow key={key}>
                <TableCell component="th" scope="row">
                    {note + key}
                </TableCell>
                <TableCell align="right">{Object.values(chords[key]).join(', ')}</TableCell>
                <TableCell align="right"><Link href={viz}>Visualizar (beta)</Link></TableCell>
            </TableRow>)
        })

        return (<TableBody>
            {cc}
        </TableBody>
        )
    }

    return (
        <div>
            <form noValidate autoComplete="off" onSubmit={handleSubmit} className={classes.noteForm}>
                <TextField id="outlined-basic" label="Fundamental" variant="standard" name="rootNote" onChange={handleNoteChange} />
                <Button type="submit" variant="contained">OK</Button>
            </form>
            { showTable && <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Acorde</TableCell>
                            <TableCell align="right">Notas</TableCell>
                            <TableCell align="right">Extras</TableCell>
                        </TableRow>
                    </TableHead>
                    { renderChords() }
                </Table>
            </TableContainer>}
        </div>
    )
}
