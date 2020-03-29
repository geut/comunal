import React, { useState, useEffect } from 'react'
import Logo from '../logo/logo'
import Stats from '../stats/stats'
import Video from '../media/video'

const Main = () => {
  const [data, setData] = useState({ drive: null })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch('http://localhost:3000')
        const drive = await result.json()
        setData({ drive })
      } catch (err) {
        console.log(err.message)
      }
    }

    fetchData()
  }, [])

  return (
    <div className='p-3 pt-8'>
      <Logo />
      <Stats driveData={data.drive} />
      <div className='my-2'>
        <Video />
      </div>
    </div>
  )
}

export default Main
