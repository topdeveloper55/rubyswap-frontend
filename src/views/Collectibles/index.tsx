import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Heading, Button, useModal, Modal, InjectedModalProps, Text, Flex, ChevronRightIcon, ChevronLeftIcon, IconButton, CloseIcon, Input } from '@twinkykms/rubyswap-uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import NftList from './components/NftList'
import { Bidify } from './utils'
// import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import PageLoader from "components/Loader/PageLoader"
import Select from 'components/Select/Select'
import SearchInput from 'components/SearchInput'
import { useLocation } from 'react-router-dom'
import axios, {AxiosResponse} from "axios";
// import { Nft } from 'config/constants/types'

const bidify = new Bidify();
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
@media screen and (max-width: 540px) {
  flex-wrap: wrap;
}
`
const StyledHead = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`
const StyledButton = styled(Button)`
  width: 100%;
`
const CustomLoadingWrapper = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center
  gap: 24px;
  font-size: 28px;
  text-align: center;
`
const InlineLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  > ${Text} {
    font-size: 14px;
  }
  > div:last-child {
    width: 100%;
  }
`
const PageNumberWrapper = styled(Flex)`
  gap: 8px;
`
interface ModalProps extends InjectedModalProps {
  description: (string | undefined)
}
interface ParamsProps {
  name: string
}
const BackButtonModal: React.FC<ModalProps> = ({description, onDismiss}) => {
  return(
    <Modal title="Not available yet" onDismiss={onDismiss} maxWidth="420px">
      <Heading as="h1" color="primary" scale='lg' my="16px" mx="auto">
        {description}
      </Heading>
      {/* <Button onClick=>Ok</Button> */}
    </Modal>
  )
}

const baseUrl = "https://api.bidify.org/api"
const Collectibles = (props) => {
  const { t } = useTranslation()
  const { chainId, account, library } = useActiveWeb3React()
  const [page, setPage] = useState(0)
  const [nftsPerPage, setNftsPerPage] = useState(10)
  const [nfts, setNfts] = useState<any>([])
  const [isAuction, setIsAuction] = useState(true)
  const [loading, setLoading] = useState(false)
  const [reloader, setReloader] = useState(0)
  const [totalCounts, setTotalCounts] = useState(0)
  const { search } = useLocation()
  // console.log(JSON.parse('{"' + decodeURI(search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'))
  const { name } = search ? JSON.parse('{"' + decodeURI(search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replaceAll("_", " ") + '"}') : search
  const [searchText, setSearchText] = useState(name ? name : "")
  const [ searching, setSearching ] = useState(name ? true : false)

  const getListsFromDatabase = async (): Promise<AxiosResponse> => {
    const ret = await axios.get(`${baseUrl}/auctions`, { params: { chainId: chainId } });
    // console.log("from database", ret);
    return ret;
  }
  const getCollectionFromDatabase = async (): Promise<AxiosResponse> => {
    const response = await axios.get(`${baseUrl}/collection`, { params: { chainId, owner: account } })
    return response;
  }
  useEffect(() => {
    // if(loading) return
    if(!chainId || !library || !account) return 
    bidify.setBidify(chainId, library, account)
    setLoading(true)
    const getBidifyNFTs = async () => {
      // const lists = await bidify.getLists(page, nftsPerPage, searching)
      // console.log("from network", lists);
      const lists = await getListsFromDatabase()
      const _nfts = lists.data
      setNfts(_nfts)
      setTotalCounts(lists.data.length)
      setLoading(false)
    }
    const getCollections = async () => {
      // const lists = await bidify.getCollection(page, nftsPerPage)
      // const _nfts = lists.details
      const lists = await getCollectionFromDatabase()
      const _nfts = lists.data;
      // setNfts(_nfts)
      setTotalCounts(lists.data.totalCounts)
      if (_nfts.length === 0) {
        const newData = await bidify.getCollection(0, 9999999)
        const _newNfts = newData.details.map(detail => {return {...detail, network: chainId}})
        // console.log("fetching from chain", update)
        setNfts(_newNfts);
        setLoading(false)
        await handleUpdate(_newNfts)
      }
      else {
        setNfts(_nfts)
        setLoading(false)
        await updateDatabase()  
      }
    }
    if(isAuction) getBidifyNFTs()
    else getCollections()
  }, [account, chainId, library, isAuction, reloader])
  const handleUpdate = async (update) => {
    if (update.length === 0) return
    // console.log(update)
      await axios.post(`${baseUrl}/admincollection`, update)
  }
  const updateDatabase = async () => {
    // console.log("updating database")
    const newData = await bidify.getCollection(0, 9999999)
    const _newNfts = newData.details.map(detail => { return {...detail, network: chainId} })
    // console.log("updated database", _newNfts)
    // console.log("comparing, ", nfts, _newNfts, nfts === _newNfts)
    await axios.put(`${baseUrl}/admincollection`, _newNfts)
  }
  const [onComingSoon] = useModal(<BackButtonModal description="Coming Soon..." />);
  const handleClickMint = () => {
    onComingSoon()
  }
  const handleClickBrowse = () => {
    if(loading) return
    if(!isAuction) setSearchText("")
    setIsAuction(true)
  }
  const handleClickList = () => {
    if(loading) return
    setIsAuction(false)
  }
  const handleClickSearch = () => {
    if(searching) return
    setSearching(true)
    setSearchText("")
  }
  const handleChange = (option) => {
    setNftsPerPage(option.value)
  }
  const handleChangePage = (value) => {
    if(value === -1) {
      if(page === 0) return;
      setPage(page - 1)
    }
    if(value === 1) {
      if((page + 1) * nftsPerPage > totalCounts) return;
      setPage(page + 1)
    }
  }
  const handleChangeQuery = (e) => {
    setSearchText(e.target.value)
  }
  return (
    <>
      <PageHeader>
        <StyledHero>
          <Heading as="h1" scale="xxl" color="secondary">
            {t('NFTs')}
          </Heading>
          <Heading as="h1" scale="lg" color="secondary">
            <a href="https://bidify.org" target="_blank" rel="noreferrer" >{t('Powered by Bidify')}</a>
          </Heading>
        </StyledHero>
        <StyledToolbar>
          <StyledButton onClick={handleClickBrowse} variant="danger">Browse</StyledButton>
          <StyledButton onClick={handleClickSearch} variant="danger">Search</StyledButton>
          <StyledButton onClick={handleClickList} variant="danger">List an NFT</StyledButton>
          <StyledButton onClick={handleClickMint} variant="danger">Mint an NFT</StyledButton>
        </StyledToolbar>
        <StyledHead >
          <Heading as="h1" scale="xl" color="secondary">
            {t(isAuction ? "Current Auctions" : "My Collection")}
          </Heading>
          {isAuction && searching &&
          <Flex alignItems="center" >
            <Input value={searchText} onChange={handleChangeQuery} placeholder="Search NFTs" />
            <IconButton style={{minWidth: 32}} ml={2} scale="sm" variant="danger" onClick={() => !loading && setSearching(false)}>
              <CloseIcon color="currentColor" />
            </IconButton>
          </Flex>
          }        
        </StyledHead>
      </PageHeader>
      <Page>
        {loading ? 
          <CustomLoadingWrapper>
            {/* <PageLoader/> */}
            <img src="images/bidify.gif" alt="bidify" />
            {!isAuction && <Heading mx={3} mt={3} maxWidth={600} as="h3" >We are fetching your NFTs, due to the decentralised nature of Egem and IPFS, this may take a minute or two</Heading>}
          </CustomLoadingWrapper> : 
          <NftList 
            onSuccess={() => {
              setReloader(reloader => reloader + 1)}
            } 
            bidify={bidify} 
            nfts={searching ? nfts : nfts.slice(page * nftsPerPage, nftsPerPage * (page + 1))}
            isAuction={isAuction} 
            searchText={searching ? searchText : ""}
          /> 
        }
        {!searching && <Flex alignItems="center" justifyContent="flex-end" >
          <InlineLabelWrapper>
            <Text mr={2}>{t('Cards/Page')}</Text>
            <Select
              options={[
                {
                  label: 10,
                  value: 10,
                },
                {
                  label: 25,
                  value: 25,
                },
                {
                  label: 50,
                  value: 50,
                },
              ]}
              
              onChange={handleChange}
            />
          </InlineLabelWrapper>
          <PageNumberWrapper>
            <IconButton scale="sm" variant="success" onClick={() => handleChangePage(-1)}>
              <ChevronLeftIcon color="currentColor" />
            </IconButton>
            <Text>{page + 1}</Text>
            <IconButton scale="sm" variant="success" onClick={() => handleChangePage(1)}>
              <ChevronRightIcon color="currentColor" />
            </IconButton>
          </PageNumberWrapper>
        </Flex>}
        
      </Page>
    </>
    
  )
}

export default Collectibles
