import React, { useState } from 'react'
import styled from 'styled-components'
// import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Button, InjectedModalProps, Modal, Text, Input, AutoRenewIcon } from '@twinkykms/rubyswap-uikit'
import { Nft } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import axios from 'axios'
import { tokens } from '../../2f2h/tokenList.json'

const baseUrl = 'https://api.bidify.org/api'

interface BidModalProps extends InjectedModalProps {
  nft: Nft
  onSuccess: () => void
  onFailed: (error) => void
  onLowBalance: () => void
  bidify: any
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`
const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 8px;
`
const StaticInput = styled(Text)`
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  // color: #720022;
  display: block;
  font-size: 16px;
  height: 40px;
  outline: 0;
  padding: 8px 16px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
`
const TokenLogo = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 2px;
`
const BidModal: React.FC<BidModalProps> = ({ nft, onSuccess, onFailed, bidify, onLowBalance, onDismiss }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { currentBid, nextBid, id, symbol, currency, name } = nft
  const logo = tokens?.filter((token) => {
    if (currency) {
      if (token.address === currency) return true
      return false
    } 
      if (token.address === '') return true
      return false
    
  })[0].logoURI
  const [yourBid, setYourBid] = useState(nextBid.toString())

  const handleConfirm = async (amount) => {
    setIsConfirming(true)
    try {
      await bidify.signBid(id, amount)
      // console.log("sign bid passed")
      await bidify.bid(id, amount)
      while (account !== (await bidify.getListing(id)).highBidder) {
        console.log('in while loop')
      }
      console.log('out of loop')
      const updateData = await bidify.getDetailFromId(id)
      await axios.put(`${baseUrl}/auctions/${id}`, updateData)
      // toastSuccess("Transaction Confirmed", `You have successfully bid on ${name}`)
      onDismiss()
      onSuccess()
    } catch (error) {
      onDismiss()
      if (error === 'low_balance') {
        // toastError("Transaction Failed", "Check your balance. Your balance is low to bid for this NFT")
        onLowBalance()
      } else {
        onFailed(error)
      }
    }
    setIsConfirming(false)
  }

  return (
    <Modal title={t('Place a Bid')} onDismiss={onDismiss}>
      <ModalContent>
        <Label htmlFor="currentBid">
          {t(`Current Bid [`)}
          <TokenLogo src={logo} alt="token logo" /> {t(` ${symbol}]:`)}
        </Label>
        <StaticInput>{currentBid ? currentBid.toString() : 0}</StaticInput>
        <Label htmlFor="nextBid">
          {t(`Minimum Next Bid [`)}
          <TokenLogo src={logo} alt="token logo" /> {t(` ${symbol}]:`)}
        </Label>
        <StaticInput>{nextBid.toString()}</StaticInput>
        <Label htmlFor="yourBid">
          {t(`Your Bid [`)}
          <TokenLogo src={logo} alt="token logo" /> {t(` ${symbol}]:`)}
        </Label>
        <Input
          id="yourBid"
          name="yourBid"
          type="number"
          // placeholder={t('')}
          defaultValue={nextBid.toString()}
          onChange={(e) => setYourBid(e.target.value)}
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
          onClick={() => handleConfirm(yourBid)}
          disabled={!account}
          isLoading={isConfirming || Number(yourBid) < Number(nextBid.toString())}
          endIcon={isConfirming ? <AutoRenewIcon color="currentColor" spin /> : null}
        >
          {t('Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default BidModal
