import ChannelsSidebar from '@/components/ChannelsSidebar'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ChannelsSidebar />
      {children}
    </div>
  )
}

export default layout