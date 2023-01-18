import Web3 from 'web3'
import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers'
import { FetchWrapper } from 'use-nft'
import { BIDIFY_ADDRESS, URLS, BIDIFY_ABI, ERC20_ABI, ERC721_ABI, ERC1155_ABI } from './config'

export class Bidify {
  chainId: number

  library: Web3Provider

  account: string

  web3: Web3

  constructor() {}

  setBidify(chainId: number, library: Web3Provider, account: string) {
    this.chainId = chainId
    this.library = library
    this.account = account
    this.web3 = new Web3(new Web3.providers.HttpProvider(URLS[this.chainId]))
  }

  async getAuctionCnts() {
    let topic0 = '0xb8160cd5a5d5f01ed9352faa7324b9df403f9c15c1ed9ba8cb8ee8ddbd50b748'
    const logs = await this.web3.eth.getPastLogs({
      fromBlock: 'earliest',
      toBlock: 'latest',
      address: BIDIFY_ADDRESS[this.chainId],
      topics: [topic0],
    })
    topic0 = '0xb78855d635dc85f7e40710ac78f3e31deb7f450cde53401783bc430e49cb22ce'
    const logs_ended = await this.web3.eth.getPastLogs({
      fromBlock: 'earliest',
      toBlock: 'latest',
      address: BIDIFY_ADDRESS[this.chainId],
      topics: [topic0],
    })
    const totalLists = []
    for (const log_listed of logs) {
      const id_listed = log_listed.topics[1]
      let isEnded = false
      for (const log_ended of logs_ended) {
        const id_ended = log_ended.topics[1]
        if (id_listed === id_ended) isEnded = true
      }
      if (!isEnded) totalLists.push(log_listed)
    }
    return totalLists
  }

  async getLists(page: number, nftsPerPage: number, searchText = false) {
    const listedLogs = await this.getAuctionCnts()
    const totalAuction = listedLogs.length
    const Lists = []
    const sId = searchText ? 0 : page * nftsPerPage
    const eId = searchText
      ? totalAuction
      : (page + 1) * nftsPerPage >= totalAuction
      ? totalAuction
      : (page + 1) * nftsPerPage
    // console.log("fro, to", sId, eId, page, nftsPerPage)
    for (let i = sId; i < eId; i++) {
      const id = parseInt(listedLogs[i].topics[1], 16).toString()
      const result = await this.getListing(id)
      Lists.push(result)
    }
    const details = await this.getDetails(Lists)
    return { details, totalCounts: totalAuction }
  }

  async getDetails(lists) {
    const unsolvedPromises = lists.map((val) => this.getFetchValues(val))
    const results = await Promise.all(unsolvedPromises)
    const filteredData = results.filter((val: any) => val?.paidOut !== true)
    const userBiddings = results.filter((value: any) =>
      value?.bids.some((val) => val.bidder?.toLocaleLowerCase() === this.account?.toLocaleLowerCase()),
    )
    return { results: filteredData, userBiddings }
  }

  async getListing(id: string) {
    const bidify = this.getBidify()
    const nullIfZeroAddress = (value) => {
      if (value === '0x0000000000000000000000000000000000000000') {
        return null
      }
      return value
    }

    const raw = await bidify.getListing(id)
    const currency = nullIfZeroAddress(raw.currency)

    const highBidder = nullIfZeroAddress(raw.highBidder)
    let currentBid = raw.price
    const nextBid = await bidify.getNextBid(id)
    const decimals = await this.getDecimals(currency)
    if (currentBid.toString() === nextBid.toString()) {
      currentBid = null
    } else {
      currentBid = this.unatomic(currentBid.toString(), decimals)
    }

    const referrer = nullIfZeroAddress(raw.referrer)
    const marketplace = nullIfZeroAddress(raw.marketplace)

    const bids = []
    for (const bid of await this.web3.eth.getPastLogs({
      fromBlock: 0,
      toBlock: 'latest',
      address: BIDIFY_ADDRESS[this.chainId],
      topics: [
        '0xdbf5dea084c6b3ed344cc0976b2643f2c9a3400350e04162ea3f7302c16ee914',
        `0x${  BigNumber.from(id).toHexString().substr(2).padStart(64, '0')}`,
      ],
    })) {
      bids.push({
        bidder: `0x${  bid.topics[2].substr(-40)}`,
        price: this.unatomic(BigNumber.from(bid.data).toString(), decimals),
      })
    }
    return {
      id,
      creator: raw.creator,
      currency,
      platform: raw.platform,
      token: raw.token.toString(),

      highBidder,
      currentBid,
      nextBid: this.unatomic(nextBid.toString(), decimals),

      referrer,
      allowMarketplace: raw.allowMarketplace,
      marketplace,

      endTime: raw.endTime.toString(),
      paidOut: raw.paidOut,
      isERC721: raw.isERC721,

      bids,
    }
  }

  async getFetchValues(val) {
    let provider
    switch (this.chainId) {
      case 1:
        provider = new ethers.providers.InfuraProvider('mainnet', '0c8149f8e63b4b818d441dd7f74ab618')
        break
      case 3:
        provider = new ethers.providers.InfuraProvider('ropsten', '0c8149f8e63b4b818d441dd7f74ab618')
        break
      case 4:
        provider = new ethers.providers.InfuraProvider('rinkeby', '0c8149f8e63b4b818d441dd7f74ab618')
        break
      case 5:
        provider = new ethers.providers.InfuraProvider('goerli', '0c8149f8e63b4b818d441dd7f74ab618')
        break
      case 42:
        provider = new ethers.providers.InfuraProvider('kovan', '0c8149f8e63b4b818d441dd7f74ab618')
        break
      case 1987:
        provider = new ethers.providers.JsonRpcProvider('https://lb.rpc.egem.io')
        break
      default:
        console.log('select valid chain')
    }

    const ethersConfig = {
      ethers: { Contract },
      provider,
    }

    const fetcher: any = ['ethers', ethersConfig]

    function ipfsUrl(cid, path = '') {
      return `https://dweb.link/ipfs/${cid}${path}`
    }

    function imageurl(url) {
      const check = url.substr(16, 4)
      if (check === 'ipfs') {
        const manipulated = url.substr(16, 16 + 45)
        return `https://dweb.link/${  manipulated}`
      } 
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      
    }
    const fetchWrapper = new FetchWrapper(fetcher, {
      jsonProxy: (url) => {
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      },
      imageProxy: (url) => {
        return imageurl(url)
      },
      ipfsUrl: (cid, path) => {
        return ipfsUrl(cid, path)
      },
    })

    const result = await fetchWrapper.fetchNft(val?.platform, val?.token).catch((err) => {
      console.log('fetchWrapper error', err.message)
    })
    const finalResult = {
      ...result,
      platform: val?.platform,
      token: val?.token,
      // isERC721: result?.owner ? true : false,
      ...val,
    }
    return finalResult
  }

  async getNFTs() {
    const from = this.account
    const {web3} = this
    // Get all transfers to us
    const logs = await web3.eth.getPastLogs({
      fromBlock: 0,
      toBlock: 'latest',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        // "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
        // null,
        null,
        `0x${  from.split('0x')[1].padStart(64, '0')}`,
      ],
    })
    // Filter to just tokens which are still in our custody
    const res = []
    const ids = {}
    for (const log of logs) {
      if (log.topics[3] !== undefined) {
        const platform = log.address
        let token = log.topics[3]
        const erc721 = new Contract(platform, ERC721_ABI, this.getProviderOrSigner() as any)
        // console.log("getting owner")
        const owner = await erc721.ownerOf(token)
        if (owner.toLowerCase() !== from.toLowerCase()) {
          continue
        }

        const jointID = platform + token

        if (ids[jointID]) {
          continue
        }
        token = parseInt(token, 16).toString()
        ids[jointID] = true
        res.push({ platform, token })
      } else {
        continue
      }
    }
    const logs_1155 = await web3.eth.getPastLogs({
      fromBlock: 0,
      toBlock: 'latest',
      topics: [
        // "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
        null,
        null,
        `0x${  from.split('0x')[1].padStart(64, '0')}`,
      ],
    })
    for (const log of logs_1155) {
      if (log.topics[3] !== undefined) {
        const platform = log.address
        const decodeData = web3.eth.abi.decodeParameters(['uint256', 'uint256'], log.data)
        let token = web3.utils.toHex(decodeData[0])
        const erc1155 = new Contract(platform, ERC1155_ABI, this.getProviderOrSigner() as any)
        const owner = await erc1155.balanceOf(from, decodeData[0])
        if (owner < 1) continue
        // if (owner.toLowerCase() !== from.toLowerCase()) {
        //   continue;
        // }

        const jointID = platform + token

        if (ids[jointID]) {
          continue
        }
        token = token.toString()
        ids[jointID] = true
        res.push({ platform, token })
      } else {
        continue
      }
    }
    return res
  }

  async getLogs() {
    const {web3} = this
    const topic0 = '0xb8160cd5a5d5f01ed9352faa7324b9df403f9c15c1ed9ba8cb8ee8ddbd50b748'
    let logs = []
    try {
      logs = await web3.eth.getPastLogs({
        fromBlock: 'earliest',
        toBlock: 'latest',
        address: BIDIFY_ADDRESS[this.chainId],
        topics: [topic0],
      })
    } catch (e) {
      console.log(e.message)
    }

    return logs.length
  }

  async getDetailFromId(id) {
    const detail = await this.getListing(id)
    const fetchedValue = await this.getFetchValues(detail)
    return { ...fetchedValue, ...detail, network: this.chainId }
  }

  async getCollection(page: number, nftsPerPage: number) {
    let getNft
    let results = []
    // console.log("getting nft")
    getNft = await this.getNFTs()
    // console.log("get nfts", getNft);
    const sId = page * nftsPerPage
    const eId = (page + 1) * nftsPerPage > getNft.length ? getNft.length : (page + 1) * nftsPerPage
    const promises = []
    for (let i = sId; i < eId; i++) {
      try {
        // const res = await this.getFetchValues(getNft[i]);
        // results.push(res);
        promises.push(this.getFetchValues(getNft[i]))
      } catch (error) {
        console.log(error)
      }
    }
    results = await Promise.all(promises)
    // console.log("detail,", results)
    return { details: results, totalCounts: getNft.length }
  }

  async finish(id: string) {
    console.log(id, this.account, this.library, this.chainId)
    const bidify = this.getBidify()
    console.log(bidify)
    const tx = await bidify.finish(id)
    await tx.wait()
  }

  async signList({ platform, token, isERC721 }) {
    const erc721 = new Contract(platform, ERC721_ABI, this.getProviderOrSigner() as any)
    const erc1155 = new Contract(platform, ERC1155_ABI, this.getProviderOrSigner() as any)
    if (isERC721) await erc721.approve(BIDIFY_ADDRESS[this.chainId], token, { from: this.account })
    else await erc1155.setApprovalForAll(BIDIFY_ADDRESS[this.chainId], true, { from: this.account })
  }

  async list({ currency, platform, token, price, days, allowMarketplace = false, isERC721 }) {
    const decimals = await this.getDecimals(currency)
    if (!currency) {
      currency = '0x0000000000000000000000000000000000000000'
    }
    const bidify = this.getBidify()
    const tokenNum = isERC721 ? token : this.web3.utils.hexToNumberString(token)
    try {
      const tx = await bidify.list(
        currency,
        platform,
        tokenNum,
        this.atomic(price.toString(), decimals),
        Number(days),
        '0x0000000000000000000000000000000000000000',
        allowMarketplace,
        isERC721,
      )
      return await tx.wait()
    } catch (error) {
      throw error
    }
  }

  async signBid(id, amount) {
    const {currency} = await this.getListing(id)
    let balance
    if (!currency) {
      balance = await this.web3.eth.getBalance(this.account)
      balance = this.web3.utils.fromWei(balance)
    } else {
      // const bidify = await this.getBidify();
      const erc20 = new Contract(currency, ERC20_ABI, this.getProviderOrSigner() as any)
      const decimals = await this.getDecimals(currency)
      const _balance = await erc20.balanceOf(this.account)
      balance = this.unatomic(_balance.toString(), decimals)
      const allowance = await erc20.allowance(this.account, BIDIFY_ADDRESS[this.chainId])
      if (Number(amount) >= Number(this.unatomic(allowance.toString(), decimals)))
        await erc20.approve(BIDIFY_ADDRESS[this.chainId], MaxUint256)
    }
    if (Number(balance) < Number(amount)) {
      throw 'low_balance'
    }
  }

  async bid(id, amount) {
    const {currency} = await this.getListing(id)
    const decimals = await this.getDecimals(currency)
    const bidify = await this.getBidify()
    if (currency) {
      const tx = await bidify.bid(id, '0x0000000000000000000000000000000000000000', this.atomic(amount, decimals))
      console.log('bidding', tx)
      await tx.wait()
    } else {
      const tx = await bidify.bid(id, '0x0000000000000000000000000000000000000000', this.atomic(amount, decimals), {
        value: this.atomic(amount, decimals),
      })
      console.log('biddibng', tx)
      await tx.wait()
    }
  }

  getBidify(): Contract {
    const address = BIDIFY_ADDRESS[this.chainId]
    if (!this.isAddress(address) || address === AddressZero) {
      throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    return new Contract(address, BIDIFY_ABI, this.getProviderOrSigner() as any)
  }

  isAddress(value: any): string | false {
    try {
      return getAddress(value)
    } catch {
      return false
    }
  }

  getProviderOrSigner(): Web3Provider | JsonRpcSigner {
    return this.account ? this.getSigner() : this.library
  }

  getSigner(): JsonRpcSigner {
    return this.library.getSigner(this.account).connectUnchecked()
  }

  // Get the decimals of an ERC20
  async getDecimals(currency: string) {
    if (!currency) {
      return 18
    }
    return await new Contract(currency, ERC20_ABI, this.getProviderOrSigner() as any).decimals()
  }

  async getSymbol(currency: string) {
    return await new Contract(currency, ERC20_ABI, this.getProviderOrSigner() as any).symbol()
  }

  atomic(value, decimals) {
    let quantity = decimals
    if (value.indexOf('.') !== -1) {
      quantity -= value.length - value.indexOf('.') - 1
    }
    let atomicized = value.replace('.', '')
    for (let i = 0; i < quantity; i++) {
      atomicized += '0'
    }
    while (atomicized[0] === '0') {
      atomicized = atomicized.substr(1)
    }
    return BigNumber.from(atomicized)
  }

  // Convert to a human readable value
  unatomic(_value: string, decimals: number) {
    const value = _value.padStart(decimals + 1, '0')
    let temp = `${value.substr(0, value.length - decimals)  }.${  value.substr(value.length - decimals)}`
    while (temp[0] === '0') {
      temp = temp.substr(1)
    }
    while (temp.endsWith('0')) {
      temp = temp.slice(0, -1)
    }
    if (temp.endsWith('.')) {
      temp = temp.slice(0, -1)
    }
    if (temp.startsWith('.')) {
      temp = `0${  temp}`
    }

    if (temp == '') {
      return '0'
    }
    return temp
  }
}
