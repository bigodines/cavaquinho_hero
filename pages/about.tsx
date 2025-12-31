import React from 'react';
import Header from '../components/Header/Header';

export default function About() {
  return (
    <>
      <Header />
      <div className="about">
        <h1>About</h1>
        <p>
          Cavaquinho Hero is a music theory tool designed to help musicians
          understand chords, scales, and harmonic fields.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Generate triads and tetrads for any note</li>
          <li>Explore major and minor harmonic fields</li>
          <li>Learn about chord progressions and dominants</li>
        </ul>
      </div>
    </>
  );
}
