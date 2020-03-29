import React, { useState, useEffect } from 'react'

const Stats = ({ driveData }) => {
  return (
    <div className='p-2 text-gray-600 border border-collapse border-gray-800'>
      <ul>
        <li> > Drive version: {driveData ? driveData.version : '---'}</li>
      </ul>
    </div>
  )
}

export default Stats
