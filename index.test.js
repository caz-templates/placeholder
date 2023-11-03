// @ts-check

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const { default: caz, inject } = require('caz')

console.log = () => {}
console.clear = () => {}

process.env.NODE_ENV = 'test'

const temp = path.join(__dirname, 'temp')
const template = path.join(temp, 'source')

fs.mkdirSync(template, { recursive: true })
fs.cpSync(path.join(__dirname, 'package.json'), path.join(template, 'package.json'))
fs.cpSync(path.join(__dirname, 'template'), path.join(template, 'template'), { recursive: true })

const assertGenerated = async (input, output) => {
  inject(input)
  const project = path.join(temp, input[0])
  await caz(template, project, { force: true })
  for (const item of output) {
    const exists = fs.existsSync(path.join(project, item))
    assert.strictEqual(exists, true, `Expected ${item} to exist.`)
  }
}

const test = async () => {
  // TODO: test with different template or different answers
  await assertGenerated(
    ['minimal'],
    ['package.json', 'README.md']
  )
  console.info('\x1b[91m→ minimal passed\x1b[0m')

  fs.rmSync(temp, { recursive: true })
}

test().catch(err => {
  console.error(err)
  process.exit(1)
})
