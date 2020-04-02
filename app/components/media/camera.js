import React, { useRef, useState } from 'react'
import Measure from 'react-measure'
import { useUserMedia } from './useUserMedia'

const CAPTURE_OPTIONS = { video: true } // default capture options

export default function Camera () {
  const videoRef = useRef()
  const [container, setContainer] = useState({ height: 0, width: 0 })
  const mediaStream = useUserMedia(CAPTURE_OPTIONS)

  const aspectRatio = 1.5

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    console.log('mediaStream')
    videoRef.current.srcObject = mediaStream
  }

  function handleCanPlay () {
    videoRef.current.play()
  }

  function handleCapture () {
    const context = canvasRef.current.getContext('2d')

    context.drawImage(
      videoRef.current,
      offsets.x,
      offsets.y,
      container.width,
      container.height,
      0,
      0,
      container.width,
      container.height
    )

    canvasRef.current.toBlob(blob => onCapture(blob), 'image/jpeg', 1)
    setIsCanvasEmpty(false)
  }

  function handleClear () {
    const context = canvasRef.current.getContext('2d')
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    onClear()
    setIsCanvasEmpty(true)
  }

  function handleResize (contentRect) {
    setContainer({
      height: contentRect.bounds.width,
      width: contentRect.bounds.width
    })
  }

  return (
    <Measure bounds onResize={handleResize}>
      {({ measureRef }) => (
        <div ref={measureRef} style={{ height: `${container.height}px` }}>
          <video
            ref={videoRef}
            onCanPlay={handleCanPlay}
            style={{ top: `100px`, left: `200px` }}
            autoPlay
            playsInline
            muted
          />
        </div>
      )}
    </Measure>
  )
}
