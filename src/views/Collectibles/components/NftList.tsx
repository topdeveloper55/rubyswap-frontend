import React, { useEffect, useState } from 'react'
import orderBy from 'lodash/orderBy'
// import { useWeb3React } from '@web3-react/core'
// import nfts from 'config/constants/nfts'
// import { useAppDispatch } from 'state'
// import { fetchWalletNfts } from 'state/collectibles'
// import { useGetCollectibles } from 'state/hooks'
import { Heading } from '@twinkykms/rubyswap-uikit'
import styled from 'styled-components'
import NftCard from './NftCard'
import NftGrid from './NftGrid'

/**
 * A map of bunnyIds to special campaigns (NFT distribution)
 * Each NftCard is responsible for checking it's own claim status
 *
 */

const TextWrapper = styled.div`
  width: 100%;
  height: 100%;
`
const NftList = ({ nfts, isAuction, bidify, onSuccess, searchText = '' }) => {
  // const { tokenIds } = useGetCollectibles()
  // const dispatch = useAppDispatch()
  // const { account } = useWeb3React()
  const [showing, setShowing] = useState(false)
  useEffect(() => {
    setShowing(true)
    if (!isAuction) setShowing(false)
    if (isAuction && nfts) {
      nfts.forEach(nft => {
        if (nft.name.toLowerCase().includes(searchText.toLowerCase())) {
          setShowing(false)
        }
      });
    }
  }, [nfts, isAuction, searchText])
  return (
    <NftGrid>
      {isAuction &&
        orderBy(nfts, 'endTime').map((nft, index) => {
          if (nft.name.toLowerCase().includes(searchText.toLowerCase()))
            return (
              <div key={index}>
                <NftCard nft={nft} isAuction={isAuction} bidify={bidify} onSuccess={onSuccess} />
              </div>
            )
        })}

      {!isAuction &&
        nfts.length > 0 &&
        nfts.map((nft, index) => {
          return (
            <div key={index}>
              <NftCard nft={nft} isAuction={isAuction} bidify={bidify} onSuccess={onSuccess} />
            </div>
          )
        })}
      {(showing || (!isAuction && nfts.length === 0)) && (
        <TextWrapper>
          <Heading scale="lg">No items found</Heading>
        </TextWrapper>
      )}
    </NftGrid>
  )
}

export default NftList
