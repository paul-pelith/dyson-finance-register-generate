import {AddressesFullConfigWithChainName, AddressesFull} from '@dyson-finance/address/full'
import {buildReferralCode, prepareRegister, signReferral} from '@dyson-finance/dyson-interface-sdk/actions'
const zkevm = AddressesFullConfigWithChainName.polygonZkevm

export async function sign(address: string) {
  const deadline =  Math.floor(Date.now() / 1000) + 4 * 86400
  const result =  await signReferral({} as any, zkevm, AddressesFull['1101'].agency, deadline, true)
  const registerStuff = await prepareRegister({account: {address}} as any,{
    chainId: zkevm,
    contractAddress:  AddressesFull['1101'].agency,
    deadline: result.deadline,
    onceKey: result.onceKey,
    parentSig: address,
  })
  console.log({
    address,
    args: [
      ...registerStuff.args
    ]
  })
  const inviteCode = buildReferralCode({...result, parentSig: address})
  return {
    forSubmit: result,
    registerArgs: registerStuff.args,
    inviteCode,
  }
}