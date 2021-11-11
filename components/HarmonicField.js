import { Table, TableBody, TableCell, TableRow, TableHead, Paper, TableContainer, Button, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'

import { MajorDiatonicScale } from '../lib/tonality'

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
    },
    noteForm: {
        textAlign: 'center'
    }
}))

export default function HarmonicField() {
    const classes = useStyles()
    const [note, setNote] = useState('')
    const [showTable, setShowTable] = useState(false)
    const [chords, setChords] = useState([])

    const handleNoteChange = (event) => {
        setNote(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const diatonicScale = MajorDiatonicScale(note)

        if (diatonicScale?.length !== 7) {
            console.error('invalid scale')
        }
        setChords(diatonicScale)
        setShowTable(true)
        console.log(chords)
    }

    return (
        <div>
            <form noValidate autoComplete="off" onSubmit={handleSubmit} className={classes.noteForm}>
                <TextField id="outlined-basic" label="Tonalidade" variant="standard" name="rootNote" onChange={handleNoteChange} />
                <Button type="submit" variant="contained">OK</Button>
            </form>
            { showTable && <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
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
                            { chords.map((v) => {
                                return (<TableCell align="center" key={v}>{v}</TableCell>)
                            })}

                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>}
        </div>
    )
}
