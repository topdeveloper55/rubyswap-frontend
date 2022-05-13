import { ChainId } from '@twinkykms/rubyswap-sdk'
import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const BSC_BLOCK_TIME = 3

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.TESTNET]: 'https://testnet.bscscan.com',
  [ChainId.ETHERGEM]: 'https://blockscout.egem.io',
}

// RUBY_PER_BLOCK details
// 40 RUBY is minted per block
// 20 RUBY per block is sent to Burn pool (A farm just for burning cake)
// 10 RUBY per block goes to RUBY syrup pool
// 9 RUBY per block goes to Yield farms and lottery
// RUBY_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// RUBY/Block in src/views/Home/components/CakeDataRow.tsx = 19 (40 - Amount sent to burn pool)
export const RUBY_PER_BLOCK = new BigNumber(40)
export const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365) // 10512000
export const RUBY_PER_YEAR = RUBY_PER_BLOCK.times(BLOCKS_PER_YEAR)
export const BASE_URL = 'https://exchange.rubyswap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const BASE_LIQUIDITY_POOL_URL = `${BASE_URL}/pool`
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.ETHERGEM]
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 200000
export const DEFAULT_GAS_PRICE = 5

export const coins = [
  ['EGEM', '0xE5fca20e55811D461800A853f444FBC6f5B72BEa', 18],
  ['RUBY', '0xB6094af67bf43779ab704455c5DF02AD9141871B', 18],
  ['TUSD', '0x33F4999ee298CAa16265E87f00e7A8671c01D870', 18, 1]
]

export const farms = [
  ['0xB6094af67bf43779ab704455c5DF02AD9141871B', 333],
  ['0x01fe4fB380fdECc9F555E5Be4E73aA89B65C8243', 700],
  ['0x5a0Eec60E427d2dB2dFe93CDceda81251E242d0E', 100],
  ['0x86B4B00CCB7afd1b1b96afe6dE9422d360e2fF5A', 100],
  ['0xeA43DCa40d6D43bc831655661e9eA28fae9e67f2', 100]
]

export const routerAbi = [
  {
      "inputs": [

      ],
      "name": "WETH",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "tokenA",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "tokenB",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amountADesired",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountBDesired",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountAMin",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountBMin",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "addLiquidity",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amountA",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountB",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amountTokenDesired",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountTokenMin",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountETHMin",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "addLiquidityETH",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amountToken",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountETH",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
          }
      ],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [

      ],
      "name": "factory",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountOut",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "reserveIn",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "reserveOut",
              "type": "uint256"
          }
      ],
      "name": "getAmountIn",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "reserveIn",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "reserveOut",
              "type": "uint256"
          }
      ],
      "name": "getAmountOut",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amountOut",
              "type": "uint256"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountOut",
              "type": "uint256"
          },
          {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
          }
      ],
      "name": "getAmountsIn",
      "outputs": [
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
          },
          {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
          }
      ],
      "name": "getAmountsOut",
      "outputs": [
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountA",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "reserveA",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "reserveB",
              "type": "uint256"
          }
      ],
      "name": "quote",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amountB",
              "type": "uint256"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "tokenA",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "tokenB",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountAMin",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountBMin",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "removeLiquidity",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amountA",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountB",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountTokenMin",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountETHMin",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "removeLiquidityETH",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amountToken",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountETH",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountTokenMin",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountETHMin",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "removeLiquidityETHSupportingFeeOnTransferTokens",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amountETH",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountTokenMin",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountETHMin",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          },
          {
              "internalType": "bool",
              "name": "approveMax",
              "type": "bool"
          },
          {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
          },
          {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
          },
          {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
          }
      ],
      "name": "removeLiquidityETHWithPermit",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amountToken",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountETH",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountTokenMin",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountETHMin",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          },
          {
              "internalType": "bool",
              "name": "approveMax",
              "type": "bool"
          },
          {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
          },
          {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
          },
          {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
          }
      ],
      "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amountETH",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "tokenA",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "tokenB",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountAMin",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountBMin",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          },
          {
              "internalType": "bool",
              "name": "approveMax",
              "type": "bool"
          },
          {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
          },
          {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
          },
          {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
          }
      ],
      "name": "removeLiquidityWithPermit",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amountA",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountB",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountOut",
              "type": "uint256"
          },
          {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "swapETHForExactTokens",
      "outputs": [
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          }
      ],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountOutMin",
              "type": "uint256"
          },
          {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "swapExactETHForTokens",
      "outputs": [
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          }
      ],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountOutMin",
              "type": "uint256"
          },
          {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "swapExactETHForTokensSupportingFeeOnTransferTokens",
      "outputs": [

      ],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountOutMin",
              "type": "uint256"
          },
          {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "swapExactTokensForETH",
      "outputs": [
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountOutMin",
              "type": "uint256"
          },
          {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "swapExactTokensForETHSupportingFeeOnTransferTokens",
      "outputs": [

      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountOutMin",
              "type": "uint256"
          },
          {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "swapExactTokensForTokens",
      "outputs": [
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountOutMin",
              "type": "uint256"
          },
          {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
      "outputs": [

      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountOut",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountInMax",
              "type": "uint256"
          },
          {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "swapTokensForExactETH",
      "outputs": [
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountOut",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amountInMax",
              "type": "uint256"
          },
          {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          }
      ],
      "name": "swapTokensForExactTokens",
      "outputs": [
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  }
]

export const pairAbi = [
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Approval",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount0",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount1",
              "type": "uint256"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
          }
      ],
      "name": "Burn",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount0",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount1",
              "type": "uint256"
          }
      ],
      "name": "Mint",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount0In",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount1In",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount0Out",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount1Out",
              "type": "uint256"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
          }
      ],
      "name": "Swap",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "uint112",
              "name": "reserve0",
              "type": "uint112"
          },
          {
              "indexed": false,
              "internalType": "uint112",
              "name": "reserve1",
              "type": "uint112"
          }
      ],
      "name": "Sync",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Transfer",
      "type": "event"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "DOMAIN_SEPARATOR",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "MINIMUM_LIQUIDITY",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "PERMIT_TYPEHASH",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "spender",
              "type": "address"
          }
      ],
      "name": "allowance",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "internalType": "address",
              "name": "spender",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "name": "balanceOf",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          }
      ],
      "name": "burn",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "amount0",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amount1",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "decimals",
      "outputs": [
          {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
          }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "factory",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "getReserves",
      "outputs": [
          {
              "internalType": "uint112",
              "name": "reserve0",
              "type": "uint112"
          },
          {
              "internalType": "uint112",
              "name": "reserve1",
              "type": "uint112"
          },
          {
              "internalType": "uint32",
              "name": "blockTimestampLast",
              "type": "uint32"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "initialize",
      "outputs": [

      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "kLast",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          }
      ],
      "name": "mint",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "name",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "name": "nonces",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "spender",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          },
          {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
          },
          {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
          },
          {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
          }
      ],
      "name": "permit",
      "outputs": [

      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "price0CumulativeLast",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "price1CumulativeLast",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          }
      ],
      "name": "skim",
      "outputs": [

      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amount0Out",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "amount1Out",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
          }
      ],
      "name": "swap",
      "outputs": [

      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "symbol",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [

      ],
      "name": "sync",
      "outputs": [

      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "token0",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "token1",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [

      ],
      "name": "totalSupply",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "transfer",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "internalType": "address",
              "name": "from",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "transferFrom",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  }
]