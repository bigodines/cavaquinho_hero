export default function HarmonicField() {
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
