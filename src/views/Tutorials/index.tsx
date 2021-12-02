import React from 'react'
import styled from 'styled-components'
import { Flex, Heading } from '@twinkykms/rubyswap-uikit'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'

const EmbedVideo = styled.iframe`
  width: 520px;
  height: 420px;
  border-radius: 12px;
`
const VideoWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 42px;
  justify-content: center;
`

export default function Tutorials() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Tutorials')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Learn how to use Rubyswap')}
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <VideoWrapper>
          <EmbedVideo
            src={`https://www.youtube.com/embed/Fiy7YDaXUz4`}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="How to SWAP RUBY"
          />
          <EmbedVideo
            src={`https://www.youtube.com/embed/YGE-GxArA-M`}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="How to Add liquidity"
          />
          <EmbedVideo
            src={`https://www.youtube.com/embed/LBGhu2G6_m4`}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="how to FARM RUBY"
          />
          <EmbedVideo
            src={`https://www.youtube.com/embed/8JOHkP3XntA`}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="How to STAKE RUBY"
          />
        </VideoWrapper>
      </Page>
    </>
  )
}
