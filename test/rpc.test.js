import { jest } from '@jest/globals';
import { rpc } from "../rpc"
beforeEach(() => {
    jest.clearAllMocks()
})

test('dummy test', () => {
    rpc.makeRPC = jest.fn(() => "locktopus");
    const result = rpc.makeRPC(null, null, null)
    expect(result).toBe('locktopus')
})

test('get block', () => {
    rpc.makeRPC = jest.fn()
    rpc.getBlock("https://myrpc.com/", '10')
    expect(rpc.makeRPC).toHaveBeenCalledWith("https://myrpc.com/", "eth_getBlockByNumber", ['10', false])
})