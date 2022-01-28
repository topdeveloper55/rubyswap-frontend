import React from 'react'
import styled from 'styled-components'
import { Heading, Button } from '@twinkykms/rubyswap-uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import NftList from './components/NftList'

const StyledHero = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 32px;
  display: flex;
  align-items: flex-end;
  gap: 16px;
`
const StyledToolbar = styled.div`
margin-bottom: 12px;
display: flex;
align-items: flex-end;
gap: 16px;
`
const StyledButton = styled(Button)`
  width: 100%;
`
const Collectibles = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledHero>
        <Heading as="h1" scale="xxl" color="secondary">
          {t('NFTs')}
        </Heading>
        <Heading as="h1" scale="lg" color="secondary">
          {t('Powered by Bidify')}
        </Heading>
      </StyledHero>
      <StyledToolbar>
        <StyledButton onClick={() => console.log("onclick")} variant="danger">Browse</StyledButton>
        <StyledButton onClick={() => console.log("onclick")} variant="danger">Search</StyledButton>
        <StyledButton onClick={() => console.log("onclick")} variant="danger">List</StyledButton>
        <StyledButton onClick={() => console.log("onclick")} variant="danger">Mint</StyledButton>
      </StyledToolbar>
      <Heading as="h1" scale="xl" color="secondary">
        {t('Current Auctions')}
      </Heading>
      <NftList />
    </Page>
  )
}

export default Collectibles
