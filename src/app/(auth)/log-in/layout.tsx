import React from 'react'
import Image from 'next/image'

const layout = ({children} : any) => {
  return (
    <div className="relative h-screen w-screen">
        <div className="absolute inset-0 -z-100">
          <Image src='/image.png' alt='slime' layout="fill" objectFit="cover" />
        </div>
        <div className="flex relative z-100 items-center justify-center h-full">
          {children}
        </div>
      </div>
  )
}

export default layout