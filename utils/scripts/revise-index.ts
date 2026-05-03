import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import { findFiles } from '../src/node/utils/file/find.js'

const list = await findFiles(path.join(import.meta.dirname, '../src/'), 'index.ts')
list.forEach(async (file) => {
  const content = await fs.readFile(file, 'utf8')
  await fs.writeFile(file, content.replace(/";/g, '.js";'), 'utf8')
})
