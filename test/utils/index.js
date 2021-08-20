import { toBN } from './web3'
require('./chai')

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const BYTES32_ZERO = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const BYTES_ZERO = '0x0'

export const getBalance = async addr => toBN(await web3.eth.getBalance(addr))