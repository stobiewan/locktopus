import { jest } from '@jest/globals'
import { locktopus } from '../locktopus.js'
import * as rpc from '../rpc.js'

const dummy_url = "https://myrpc.com/"
rpc.rpc.makeRPC = jest.fn()

beforeEach(() => {
    locktopus.set_config({'eth_rpc': dummy_url, 'finality': '60'})
})

test('test init last', () => {
    rpc.rpc.makeRPC.mockReturnValueOnce({"timestamp": '1'})
    const getBlock = jest.spyOn(rpc.rpc, 'getBlock')
    locktopus.init_last()
    expect(getBlock).toHaveBeenCalledWith(dummy_url, 'latest')
    expect(rpc.rpc.makeRPC).toHaveBeenCalledWith(
        dummy_url,
        "eth_getBlockByNumber",
        ['latest', false]
    )
})

