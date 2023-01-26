import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Nft } from 'config/constants/types'
import FleekImage from '../../../../assets/placeholders/fleek.gif'
import NFTPortImage from '../../../../assets/placeholders/nftport.gif'
import IpfsImage from '../../../../assets/placeholders/ipfs.gif'

interface PreviewProps {
  nft: Nft
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBorder};
  position: relative;
  width: 100%;
  overflow: hidden;
  padding-bottom: 100%;
`

const StyledImage = styled.img`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  transition: opacity 1s linear;
  height: 100%;
  object-fit: cover;
  border-radius: 24px 24px 0 0;
`
const StyledVideo = styled.video`
  height: 100%;
  width: 100%;
`

const Preview: React.FC<PreviewProps> = ({ nft }) => {
  const { image, name, video } = nft
  const previewImageSrc = image
  const [loading, setLoading] = useState(true)
  const [placeholder, setPlaceholder] = useState("")

  useEffect(() => {
    if (previewImageSrc.includes('storage.googleapis.com')) return setPlaceholder(NFTPortImage)
    if (previewImageSrc.includes('fleek.co')) return setPlaceholder(FleekImage)
    return setPlaceholder(IpfsImage)
  }, [previewImageSrc])

  if (video) {
    const videoComponent = (
      <StyledVideo autoPlay controls={false} loop muted poster={previewImageSrc}>
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </StyledVideo>
    )

    return videoComponent
  }

  return <Container>
    {loading && <StyledImage src={placeholder} alt="placeholer" style={{zIndex:2}}/>}
    <StyledImage src={previewImageSrc} alt="placeholer" onLoad={() => {setLoading(false)}} style={{zIndex:1}}/>
  </Container>
}

export default Preview
