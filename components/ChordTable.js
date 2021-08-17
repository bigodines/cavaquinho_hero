import { Table, TableBody, TableCell, TableRow, TableHead, Paper, TableContainer, Button, TextField } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
            flexgrow: 1
        }
    }
}))

export default function ChordTable() {
    const classes = useStyles()
    const [note, setNote] = useState('C')
    const [showTable, setShowTable] = useState(false)

    const chords = {}

    const handleNoteChange = (event) => {
        setNote(event.target.value)
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
                        {rows.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>}
        </div>
    )
}
