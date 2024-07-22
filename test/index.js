import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { remark } from 'remark'
import rehypeTextmarker from '../index.js'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeFormat from 'rehype-format'
import rehypeDocument from 'rehype-document'

test('rehype-textmarker', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('../index.js')).sort(), ['default'])
  })
})

test('fixtures', async function (t) {
  const root = './test/fixtures/'
  const fixtures = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
  for (let fixture of fixtures) {
    await t.test(fixture, async function () {
      const files = fs
        .readdirSync(path.join(root, fixture), { withFileTypes: true })
        .filter((item) => !item.isDirectory())
        .map((item) => item.name)
      const inputFile = path.join(
        root,
        fixture,
        files.find((elem) => elem === 'input.md')
      )
      const outputFile = path.join(
        root,
        fixture,
        files.find((elem) => elem === 'output.html')
      )
      const configFile = path.join(
        './fixtures/',
        fixture,
        files.find((elem) => elem === 'config.js')
      )
      let { config } = await import('./' + configFile)
      let input = String(fs.readFileSync(inputFile))
      let output = String(fs.readFileSync(outputFile))
      try {
        const file = await remark()
          .use(remarkRehype)
          .use(rehypeTextmarker, config)
          .use(rehypeDocument, { title: 'Title', language: 'en' })
          .use(rehypeFormat, { indent: '\t' })
          .use(rehypeStringify)
          .process(input)
        assert.equal(String(file), output)
      } catch (error) {
        throw error
      }
    })
  }
})
