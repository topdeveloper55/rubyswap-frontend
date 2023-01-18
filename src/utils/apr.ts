import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, RUBY_PER_YEAR, coins, farms, routerAbi, pairAbi } from 'config'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
// import lpAprs from 'config/constants/lpAprs.json'

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
const web3 = new Web3(new Web3.providers.HttpProvider('https://lb.rpc.egem.io'))

export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = async (lpString: string) => {
  // console.log("getting farm apr")
  const str = lpString.toLowerCase()
  let APR: number
  if (str === 'ruby') {
    const lp = new web3.eth.Contract(pairAbi as AbiItem[], farms[0][0].toString())
    const annualRewards = (Number(farms[0][1]) / 1333) * 10 * 6646 * 365
    const staked = await lp.methods.balanceOf('0x24032900bBa1Ef1CB822Df299548Efb222E05614').call()
    APR = (annualRewards / (staked / 1e18)) * 100
  } else if (str.includes('ruby')) {
    if (str.includes('egem')) APR = await getAPRwRUBY(farms[1], 0)
    else if (str.includes('tusd')) APR = await getAPRwRUBY(farms[3], 1)
    else if (str.includes('tosa')) APR = await getAPRwRUBY(farms[4], 1)
  } else if (str.includes('egem') && str.includes('tusd')) {
      APR = await getAPRwoRUBY(farms[2], 0)
    }
  return APR
  // const yearlyCakeRewardAllocation = RUBY_PER_YEAR.times(poolWeight)
  // const cakeRewardsApr = yearlyCakeRewardAllocation.times(cakePriceUsd).div(poolLiquidityUsd).times(100)
  // let cakeRewardsAprAsNumber = null
  // if (!cakeRewardsApr.isNaN() && cakeRewardsApr.isFinite()) {
  //   cakeRewardsAprAsNumber = cakeRewardsApr.toNumber()
  // }
  // const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  // return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr }
}

const getAPRwRUBY = async (farm, i) => {
  const lp = new web3.eth.Contract(pairAbi as AbiItem[], farm[0])
  const rubyInFarm = await lp.methods.getReserves().call()
  const annualRewards = (farm[1] / 1333) * 10 * 6646 * 365
  const APR = (annualRewards / ((rubyInFarm[i] / 10 ** 18) * 2)) * 100
  return APR
}

const getAPRwoRUBY = async (farm, i) => {
  const router = new web3.eth.Contract(routerAbi as AbiItem[], '0x6739D25c56d13F14E05a8eadBF237057023F2f4D')
  const priceSell = await router.methods
    .getAmountsOut('1000000000000000000', [coins[1][1], '0x33F4999ee298CAa16265E87f00e7A8671c01D870'])
    .call()
  const priceBuy = await router.methods
    .getAmountsIn('1000000000000000000', ['0x33F4999ee298CAa16265E87f00e7A8671c01D870', coins[1][1]])
    .call()
  const priceRUBY = (Number(priceSell[1]) + Number(priceBuy[0])) / 2 / 10 ** 18
  const annualRewardsValue = (farm[1] / 1333) * 10 * 6646 * 365 * priceRUBY
  const lp = new web3.eth.Contract(pairAbi as AbiItem[], farm[0])
  const tusdInFarm = await lp.methods.getReserves().call()
  const APR = (annualRewardsValue / ((tusdInFarm[i] / 10 ** 18) * 2)) * 100
  return APR
}

export default null
