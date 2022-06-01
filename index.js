import process from 'node:process'
import { Command } from 'commander'
import Database from 'better-sqlite3'
import lib from './lib/dmap/dmap.js'
import { rpc }  from './rpc.js'
import { jams } from 'jams.js'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import os from 'os'

let config = {}
const program = new Command();

const dir = `${os.homedir()}/.locktopus`
if (!existsSync(dir)) mkdirSync(dir)
const db = new Database(`${dir}/locktopus.sqlite`, { verbose: console.log })
const create = db.prepare("CREATE TABLE IF NOT EXISTS locks(" +
    "'when' INTEGER, 'zone' TEXT, 'name' TEXT,'path' TEXT PRIMARY KEY, 'meta' TEXT, 'data' TEXT )")
create.run();

program
    .name('dmap')
    .description('dmap interface tools')
    .version('0.1.0')
    .option('-c, --config-dir <string>', 'path to your jams config file',
            dir)
    .hook('preAction', (_, __) => {
        config = jams(readFileSync(`${program.opts().configDir}/config.jams`, {encoding: 'utf-8'}))
    });

program.command('walk')
    .description('Read a value from a dpath with caching')
    .argument('<string>', 'dpath to read')
    .action((dpath) => {
        look(dpath)
    });

const seek = (path) => {
    let miss = true
    let meta, data
    const stmt = db.prepare('SELECT * FROM locks WHERE path = ?')
    const lock = stmt.get(path)
    if (lock !== undefined) {
        miss = false
        meta = lock.meta
        data = lock.data
    }
    return [miss, meta, data]
}

const save = (meta, data, trace, path, when) => {
    if ((lib._hexToArrayBuffer(meta)[31] & lib.FLAG_LOCK) === 0) return
    const zone = trace.length > 1 ? trace.slice(-2)[0][1] : '0x' + '0'.repeat(64)
    const name = path.split(/[:.]/).slice(-1)[0]
    const insert = db.prepare('INSERT INTO locks VALUES (@when, @zone, @name, @path, @meta, @data)')
    insert.run({ when: when, zone: zone, name: name, path: path, meta: meta, data: data })
}

const look = async (path) => {
    let [miss, meta, data] = seek(path)
    if (miss) {
        let when = 0
        const dmap = await rpc.getFacade(config.eth_rpc)
        const trace = await lib.walk2(dmap, path);
<<<<<<< HEAD
        [meta, data] = trace.slice(-1)[0];
        let name = _getNameFromPath(path);
        name = '0x' + lib._strToHex(name) + '0'.repeat(64 - name.length * 2)
        // Should only do this if meta is locked
        let events = await rpc.getPastEvents(config.eth_rpc, lib.address,[
            null, // TODO: DMFXYZ filter on zone/caller address as well,
            name,
            null,
            null
        ]);
        // TODO: !DMFXYZ! Double check sorting logic
        events.sort((e1, e2) => {
            return BigInt(e1.blockNumber) - BigInt(e2.blockNumber)
        })
        let timestamp = (await rpc.getBlock(config.eth_rpc, events.reverse()[0].blockNumber)).timestamp
        console.log(parseInt(timestamp))
        save(trace)
=======
        [meta, data] = trace.slice(-1)[0]
        save(meta, data, trace, path, when)
>>>>>>> integration
    }
    console.log(`meta: ${meta}\ndata: ${data}`)
}

<<<<<<< HEAD
function _getNameFromPath(path) {
    if(path.lastIndexOf(".") > path.lastIndexOf(':')) {
        return path.substring(path.lastIndexOf('.') + 1)
    } else {
        return path.substring(path.lastIndexOf(':') + 1)
    }
}

=======
process.on('exit', () => db.close())
>>>>>>> integration
program.parse();
