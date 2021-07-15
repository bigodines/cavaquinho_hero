import { TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch'
        }
    }
}))

export default function ChordTable() {
    const classes = useStyles()

    return (
        <div>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Fundamental" variant="standard" />
            </form>
        </div>
    )
}
