import React from 'react'
import styled from 'styled-components'
import { Nft } from 'config/constants/types'

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
const StyledPanel = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  transition: opacity 1s linear;
  height: 100%;
  object-fit: cover;
  border-radius: 24px 24px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledVideo = styled.video`
  height: 100%;
  width: 100%;
`

const Preview: React.FC<PreviewProps> = ({ nft }) => {
  const { image, name, video } = nft
  const previewImageSrc = image

  if (video) {
    const videoComponent = (
      <StyledVideo autoPlay controls={false} loop muted poster={previewImageSrc}>
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </StyledVideo>
    )

    return videoComponent
  }

  const previewImage = previewImageSrc ? (
    <StyledImage src={previewImageSrc} alt={name} />
  ) : (
    <StyledPanel>Loading Image...</StyledPanel>
  )

  return <Container>{previewImage}</Container>
}

export default Preview
