import * as path from 'node:path'
import * as fs from 'node:fs'
import * as url from 'node:url'

const indexFilePath = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '../src/index.ts')
const content = fs.readFileSync(indexFilePath, 'utf8')

fs.writeFileSync(indexFilePath, content.replaceAll('";', '.js";'), 'utf8')
