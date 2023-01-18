import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { AutoRenewIcon, Button, Flex, Input, Modal, Text } from '@twinkykms/rubyswap-uikit'
// import { getAddressByType } from 'utils/collectibles'
import { Nft } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
// import { useERC721 } from 'hooks/useContract'
import Select from 'components/Select/Select'
import axios, { AxiosResponse } from 'axios'
import InfoRow from './InfoRow'

const baseUrl = 'https://api.bidify.org/api'

interface CreateAuctionModalProps {
  nft: Nft
  bidify: any
  onSuccess: () => any
  onDismiss?: () => void
  onFailed: (error) => void
}

const ModalContent = styled.div`
  margin-bottom: 16px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  > div:first-of-type {
    width: 100%;
  }
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
  padding: 0px;
`

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: block;
  margin-bottom: 8px;
  margin-top: 16px;
`
const StyledImage = styled.img`
  width: 100%;
  transition: opacity 1s linear;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  max-width: 250px;
  margin: auto;
`

const tokens = [
  {
    id: 0,
    symbol: 'EGEM',
    logoURI: 'https://raw.githubusercontent.com/top1st/token-assets/main/png/egem.png',
    address: null,
  },
  {
    id: 1,
    symbol: 'RUBY',
    logoURI: 'https://raw.githubusercontent.com/top1st/token-assets/main/png/ruby.png',
    address: '0xB6094af67bf43779ab704455c5DF02AD9141871B',
  },
  {
    id: 2,
    symbol: 'TUSD',
    logoURI: 'https://cryptologos.cc/logos/trueusd-tusd-logo.png?v=014',
    address: '0x33F4999ee298CAa16265E87f00e7A8671c01D870',
  },
]
const TokenSymbol = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  &.inactive {
    color: grey;
    img {
      filter: opacity(0.5) grayscale(1);
    }
  }
`
const TokenLogo = styled.img`
  width: 20px;
  height: 20px;
`
const CreateAuctionModal: React.FC<CreateAuctionModalProps> = ({ nft, bidify, onSuccess, onDismiss, onFailed }) => {
  // const [isLoading, setIsLoading] = useState(false)
  const [bidAmount, setBidAmount] = useState()
  const [duration, setDuration] = useState()
  // const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currency, setCurrency] = useState('')
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastSuccess } = useToast()
  const handleConfirm = async () => {
    const price = bidAmount
    const days = duration
    const { platform, token, owner, name, image } = nft
    const isERC721 = !!owner
    // setIsModal(false);
    setIsLoading(true)
    // setProcessContent(
    //   "Please allow https://bidify.org permission within your wallet when prompted, there will be a small fee for this…"
    // );
    try {
      await bidify.signList({ platform, token, isERC721 })
      // setProcessContent(
      //   "Confirm the second transaction to allow your NFT to be listed, there will be another small network fee."
      // );
      const logs = await bidify.getLogs()
      await bidify.list({ currency, platform, token, price, days, isERC721 })
      while ((await bidify.getLogs()) === logs) {
        console.log('while loop')
      }
      const listingDetail = await bidify.getDetailFromId(logs)
      await axios.post(`${baseUrl}/auctions`, listingDetail)
      setIsLoading(false)
      onDismiss()
      onSuccess()
      // setIsSuccess(true);
      // getDetails();
      // setTimeout(() => {
      //   setIsSuccess(false);
      // }, 3000);
    } catch (error) {
      setIsLoading(false)
      onFailed(error)
      onDismiss()
      // setIsError(true);
      // setTimeout(() => {
      //   setIsError(false);
      // }, 3000);
    }
  }
  const handleChange = (e) => {
    if (e.target.name === 'duration') setDuration(e.target.value)
    else setBidAmount(e.target.value)
  }
  const options = useMemo(() => {
    return tokens.map((token) => {
      return {
        label: (
          <TokenSymbol>
            <TokenLogo src={token.logoURI} alt="logo" />
            {token.symbol}
          </TokenSymbol>
        ),
        value: token.address,
      }
    })
  }, [])
  const handleTokenChange = (option) => {
    setCurrency(option.value)
  }
  return (
    <Modal title={t('%nftName%', { nftName: nft.name })} onDismiss={onDismiss}>
      <ModalContent>
        <StyledImage src={nft.image} alt={nft.name} />
        <Label>{t('Auction Currency')}</Label>
        <Select options={options} onChange={handleTokenChange} />
        <Label htmlFor="bidAmount">{t('Initial Bid Amount')}:</Label>
        <Input
          id="bidAmount"
          name="bidAmount"
          type="number"
          // placeholder={t('')}
          value={bidAmount}
          onChange={handleChange}
          // isWarning={error}
          // disabled={isLoading}
        />
        <Label htmlFor="duration">{t('Bidding Days')}:</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          // placeholder={t('')}
          value={duration}
          onChange={handleChange}
          // isWarning={error}
          // disabled={isLoading}
        />
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
        <Button
          width="100%"
          onClick={handleConfirm}
          isLoading={isLoading || !account || !bidAmount || !duration}
          endIcon={isLoading && <AutoRenewIcon spin color="currentColor" />}
        >
          {t('Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default CreateAuctionModal
