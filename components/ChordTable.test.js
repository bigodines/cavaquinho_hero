/**
 * @jest-environment jsdom
 */
import React from 'react'
import renderer from 'react-test-renderer'
import ChordTable from './ChordTable'

describe('ChordTable', () => {
    it('can run tests', () => {
        expect(true).toBe(true)
    })

    it('Renders empty state', () => {
        const tree = renderer.create(<ChordTable />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
