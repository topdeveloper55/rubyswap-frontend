import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import {
  Card,
  CardBody,
  Heading,
  Button,
  Text,
  useModal,
  AutoRenewIcon,
} from '@twinkykms/rubyswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { Nft } from 'config/constants/types'
import InfoRow from '../InfoRow'
import CreateAuctionModal from '../CreateAuctionModal'
import BidModal from '../BidModal'
import Preview from './Preview'
import { useWeb3React } from '@web3-react/core'
import lock from "./lock.svg"
import Countdown from "react-countdown"
import useToast from 'hooks/useToast'
import ListSuccessModal from '../ListSuccessModal'
import GetTokenModal from '../GetTokenModal'
import BidSuccessModal from '../BidSuccessModal'
import axios from 'axios'

const baseUrl = "https://api.bidify.org/api"

export interface NftCardProps {
  nft: Nft
  isAuction: boolean
  bidify: any
  onSuccess?: any
}

const Header = styled(InfoRow)`
  // min-height: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const InfoBlock = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const CurrentBid = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
const EndsIn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`
const Description = styled.pre`
  line-height: 22px;
  margin-top: 8px;
  white-space: pre-wrap;
`
const NftCard: React.FC<NftCardProps> = ({ nft, isAuction, bidify, onSuccess }) => {
  const [symbol, setSymbol] = useState('')
  const { t } = useTranslation()
  const { account, chainId } = useWeb3React()
  const { name, creator, image, currentBid, endTime, id, currency, highBidder, description } = nft
  // console.log("nft", nft)
  const [isLoading, setIsLoading] = useState(false);
  const isUser = account?.toLocaleLowerCase() === creator?.toLocaleLowerCase();
  const isHighBidder = account?.toLocaleLowerCase() === highBidder?.toLocaleLowerCase();
  const { toastSuccess, toastError } = useToast()
  
  useEffect(() => {
    const getSymbols = async () => {
      if(currency === "0x0000000000000000000000000000000000000000" || !currency) {
        switch(chainId) {
          case 1987:
            setSymbol("EGEM")
            break
          default: 
            setSymbol("ETH")
            break
        }
        return
      }
      const res = await bidify.getSymbol(currency);
      setSymbol(res.toUpperCase());
    }
    if(chainId) getSymbols()
  }, [chainId]);


  const [onListSuccess] = useModal(
    <ListSuccessModal nft={nft} />
  )
  const [onBidSuccess] = useModal(
    <BidSuccessModal nft={nft} />
  )
  const [onGetToken] = useModal(
    <GetTokenModal token={symbol} address={currency} /> 
  )
  const handleSuccess = () => {
    onListSuccess()
    onSuccess()
  }
  const handleBidSuccess = () => {
    onBidSuccess()
    onSuccess()
  }
  const onFailed = (error: Error) => {
    toastError("Transaction Failed", error.message)
  }
  const onLowBalance = () => {
    onGetToken()
  }
  const [onCreateAuctionModal] = useModal(
    <CreateAuctionModal nft={nft} onFailed={onFailed} bidify={bidify} onSuccess={handleSuccess} />,
  )
  
  const [onBidModal] = useModal(
    <BidModal nft={{...nft, symbol}} onSuccess={handleBidSuccess} bidify={bidify} onFailed={onFailed} onLowBalance={onLowBalance} />
  )

  const handleClick = async () => {
    onBidModal()
  }

  const handleFinishAuction = async () => {
    setIsLoading(true);
    try {
      await bidify.finish(id);
      toastSuccess("Transaction Confirmed", "Finished auction successfully!")
      const updateData = await bidify.getDetailFromId(id);
      await axios.put(`${baseUrl}/auctions/${id}`, updateData)
      onSuccess()
    } catch (error: any) {
      toastError("Transaction Failed", error.message)
      setIsLoading(false)
      console.log(error)
    }
  }
  const handleCreateAuction = async () => {
    onCreateAuctionModal()
    // console.log(name.replaceAll(" ", "%20"))
    // onListSuccess()
  }

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <>
          <InfoBlock>
            <CurrentBid>
              {
                currentBid ? 
                <Text color="primary">
                  Sold out for {currentBid} {symbol}
                </Text> : 
                <Text>Not sold out</Text>
              }
            </CurrentBid>
          </InfoBlock>
          <Button
            variant="danger"
            mt={2}
            width="100%"
            // style={{ pointerEvents: !isUser && "none" }}
            onClick={ () => handleFinishAuction() }
            isLoading={isLoading}
            endIcon={isLoading && <AutoRenewIcon spin color="currentColor" />}
          >
            Finish Auction
          </Button>
        </>
      );
    } else {
      // Render a countdown
      return (
        <>
          <InfoBlock>
            <CurrentBid>
              <Text color="primary">
                {currentBid ? currentBid : 0} {symbol}
              </Text>
              <Text style={{ fontSize: 12 }}>Current Bid</Text>
            </CurrentBid>
            <EndsIn>
              <Text color="primary">
                {days} : {hours} : {minutes} : {seconds}
              </Text>
              <Text style={{ fontSize: 12 }}>Bidding Ends In</Text>
            </EndsIn>
          </InfoBlock>
          <Button variant="success" width="100%" mt={2} onClick={handleClick} isLoading={isUser || isHighBidder}>
            {isUser ? (<img src={lock} alt="lock" width={18} />) : !isHighBidder ? t('Place a Bid') : t("You are the highest bidder")}
          </Button>
        </>
      );
    }
  };

  return (
    <Card isActive={false}>
      <Preview nft={nft} />
      <CardBody p={3} >
        <Header>
          <Heading color='primary' >{name}</Heading>
          {isAuction && <Text style={{fontSize: 12}}>{isUser ? t("By: You") : `By: #${creator?.slice(0, 4)}...${creator?.slice(creator?.length - 4)}`}</Text>}
          {isAuction ? <Countdown date={new Date(endTime * 1000)} renderer={renderer} /> :
          <Description>{description}</Description>
          }
          {!isAuction && <Button variant="success" mt={2} width="100%" onClick={handleCreateAuction} >
            {t("Create Auction")}
          </Button>}
        </Header>
      </CardBody>
    </Card>
  )
}

export default NftCard
