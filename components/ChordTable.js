import { Table, TableBody, TableCell, TableRow, TableHead, Paper, TableContainer, Button, TextField } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
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
        minWidth: 650
    }
}))

function generateChords(n) {
    if (!n || n.length < 1) {
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
    const [note, setNote] = useState('C')
    const [showTable, setShowTable] = useState(false)

    const handleNoteChange = (event) => {
        setNote(event.target.value)
        const chords = generateChords(note)

        console.log(chords)

        setShowTable(true)
    }

    return (
        <div className={classes.root}>
            <form noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Fundamental" variant="standard" value={note} onChange={handleNoteChange} />
                <Button variant="contained">OK</Button>
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
                    <TableBody>
                        {/* {rows.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                        ))} */}
                    </TableBody>
                </Table>
            </TableContainer>}
        </div>
    )
}
