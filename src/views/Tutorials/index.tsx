import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, Heading } from '@twinkykms/rubyswap-uikit'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'

import { AppHeader, AppBody } from '../../components/App'

const EmbedVideo = styled.iframe`
  width: 420px;
  height: 340px;
  border-radius: 12px;
`
const VideoWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 24px;
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
          <EmbedVideo className="tutor-video" src="https://youtu.be/Fiy7YDaXUz4" />
          <EmbedVideo className="tutor-video" src="https://youtu.be/YGE-GxArA-M" />
          <EmbedVideo className="tutor-video" src="https://youtu.be/LBGhu2G6_m4" />
          <EmbedVideo className="tutor-video" src="https://youtu.be/8JOHkP3XntA" />
        </VideoWrapper>
      </Page>
    </>
  )
}
