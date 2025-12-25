import React from 'react'
import { StyledNoVideos } from './style'

function NoVideos({children}) {
  return (
    <StyledNoVideos>
        {children}
    </StyledNoVideos>
  )
}

export default NoVideos