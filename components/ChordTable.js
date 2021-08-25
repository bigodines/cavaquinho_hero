import { Table, TableBody, TableCell, TableRow, TableHead, Paper, TableContainer, Button, TextField } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import { sizeWidth } from '@material-ui/system'
import React, { useState } from 'react'
import * as chords from '../lib/chords'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
            flexgrow: 1
        }
    },
    table: {
        minWidth: 650,
        width: 1200
    }
}))

function generateChords(n) {
    console.log('debigo')
    console.log(n)

    if (!n || n.length < 1) {
        return null
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

export default function ChordTable() {
    const classes = useStyles()
    const [note, setNote] = useState('')
    const [showTable, setShowTable] = useState(false)
    const [chords, setChords] = useState({})

    const renderChords = () => {
        console.log(Object.keys(chords))
        const cc = Object.keys(chords).map((key, i) => {
            console.log(key)
            return (<TableRow key={key}>
                <TableCell component="th" scope="row">
                    {note + key}
                </TableCell>
                <TableCell align="right">{Object.values(chords[key]).join(',')}</TableCell>
                <TableCell align="right"></TableCell>
            </TableRow>)
        })

        console.log(cc)
        return (<TableBody>
            {cc}
        </TableBody>
        )
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const c = generateChords(note)

        console.log(chords)

        setShowTable(true)
        setChords(c)
    }

    const handleNoteChange = (event) => {
        setNote(event.target.value)

        console.log(note)
    }

    return (
        <div className={classes.root}>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField id="outlined-basic" label="Fundamental" variant="standard" value={note} onChange={handleNoteChange} />
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

                    {/* {rows.map((row) => (

                        ))} */}

                </Table>
            </TableContainer>}
        </div>
    )
}
