import { Button, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

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
    const [note, setNote] = React.useState('C')

    const handleNoteChange = (event) => {
        setNote('E')
        console.log('worked')
    }

    return (
        <div className={classes.root}>
            <form noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Fundamental" variant="standard">{note}</TextField>
                <Button variant="contained" onClick={handleNoteChange}>OK</Button>
            </form>
        </div>
    )
}
