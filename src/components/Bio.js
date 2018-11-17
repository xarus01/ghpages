import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import avatar from './avatar.jpeg'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={avatar}
          alt={`Jack "Taegun" Park`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        <p>
          Written by <strong>Jack Park</strong>{' '}
          <a href="https://github.com/xarus01">
            Github
          </a>
          <a href="www.linkedin.com/in/xarus01">
            Linkedin
          </a>
        </p>
      </div>
    )
  }
}

export default Bio
