import { jest } from '@jest/globals'
import { rpc } from "../rpc"
import fetch from 'node-fetch'

const dummy_url = "https://myrpc.com/"
beforeEach(() => {
    jest.clearAllMocks()
})

test('get block', () => {
    rpc.makeRPC = jest.fn()
    rpc.getBlock(dummy_url, '10')
    expect(rpc.makeRPC).toHaveBeenCalledWith(dummy_url, "eth_getBlockByNumber", ['10', false])
})

test('get past events', () => {
    rpc.makeRPC = jest.fn()
    let address, topics = ['0x' + '00'.repeat(20), ["a", "b"]]
    rpc.getPastEvents(dummy_url, address, topics)
    expect(rpc.makeRPC).toHaveBeenCalledWith(dummy_url, "eth_getLogs", [{
        address: address,
        topics: topics,
        fromBlock: '0xe02db4',
        toBlock: 'latest'
    }])
})

test('get storage', () => {
    rpc.makeRPC = jest.fn()
    let address, slot = ['0x' + '00'.repeat(20), 0]
    rpc.RPCGetStorage(dummy_url, address, slot)
    expect(rpc.makeRPC).toHaveBeenCalledWith(
        dummy_url,
        "eth_getStorageAt",
        [address, slot, 'latest']
    )
})