import { jest } from '@jest/globals'
import { locktopus } from '../locktopus.js'
import { dummy_url, dummy_trace } from './test-constants.js'
import { rpc } from '../rpc.js'
import lib from '../lib/dmap/dmap.js'
import fs from 'fs'

rpc.makeRPC = jest.fn()

beforeEach(() => {
    locktopus.set_config({'eth_rpc': dummy_url, 'finality': '60'})
    return locktopus.init_db('./testdb')
})

afterEach(() => {
    return Promise.all([locktopus.close(),  fs.promises.rmdir('./testdb', {recursive: true, force: true})])
})

test('test init last', async () => {
    rpc.makeRPC.mockReturnValueOnce({"timestamp": '1'})
    const getBlock = jest.spyOn(rpc, 'getBlock')
    await locktopus.init_last()
    expect(getBlock).toHaveBeenCalledWith(dummy_url, 'latest')
    expect(rpc.makeRPC).toHaveBeenCalledWith(
        dummy_url,
        "eth_getBlockByNumber",
        ['latest', false]
    )
})

