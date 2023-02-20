import React from 'react'
import PropTypes from 'prop-types'

const positions = {
    // string: [50, 40, 30, 20, 10, 0], // old
    fret: [-4, 6.5, 18, 30, 42, 54, 66, 78, 90, 114, 126, 138], // where to draw the circles, hopefully at the center of the fret
    finger: [-3, 8, 19.5, 31.5, 4.5]
}

// used to align the dots with the strings in the fretboard. It varies depending on # of strings (4,5 or 6)
const stringPositions = {
  4: [50, 40, 30, 20, 10],
  5: [55, 45, 35, 25, 15, 5],
  6: [50, 40, 30, 20, 10, 0],
}

const getStringPosition = (string, strings) =>
    stringPositions[strings][string]

const radius = {
    open: 2,
    fret: 4
}

const Dot = ({ string, fret, finger, strings, lite }) =>
    fret === -1
        ? <text
            fontSize='0.7rem'
            fill='#444'
            fontFamily='Verdana'
            textAnchor='middle'
            x={getStringPosition(string, strings)}
            y='-2'
        >x</text>
        : (<g>
            <circle
                strokeWidth='0.25'
                stroke='#444'
                fill={fret === 0 ? 'transparent' : '#444'}
                cx={getStringPosition(string, strings)}
                cy={positions.fret[fret]}
                r={fret === 0 ? radius.open : radius.fret}
            />
            { !lite && finger > 0 &&
        <text
            fontSize='3pt'
            fontFamily='Verdana'
            textAnchor='middle'
            fill='white'
            x={getStringPosition(string, strings)}
            y={positions.finger[fret]}
        >{ finger }</text>}
        </g>)

Dot.propTypes = {
    string: PropTypes.number,
    fret: PropTypes.number,
    finger: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),
    strings: PropTypes.number.isRequired,
    lite: PropTypes.bool
}

Dot.defaultProps = {
    fret: 0,
    lite: false
}

export default Dot
