import React from 'react'
import styled from 'styled-components'
import { Modal, Text, Button, Flex, InjectedModalProps } from '@twinkykms/rubyswap-uikit'
import history from 'routerHistory'
import { useTranslation } from 'contexts/Localization'

interface GetTokenModalProps extends InjectedModalProps {
  token: string
  address: string
}

const GetTokenModal: React.FC<GetTokenModalProps> = ({ token, address, onDismiss }) => {
  const { t } = useTranslation()
  // const nft = getClaimableNft(profile)
  // This is required because the modal exists outside the Router
  const handleClick = () => {
    onDismiss()
    history.push(`/swap?outputCurrency=${address}`)
  }

  return (
    <Modal title={t('Transaction Failed')} onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        {/* {nft && <NftImage src={`/images/nfts/${nft.images.md}`} />} */}
        <Text color="secondary" fontSize="22px" mb="24px">
          {t(`Insufficient funds, Get more ${token}!`)}
        </Text>
        <Button onClick={handleClick}>{t('Go to Exchange')}</Button>
      </Flex>
    </Modal>
  )
}

export default GetTokenModal
