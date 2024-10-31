import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { findAllAfter } from 'unist-util-find-all-after'

const rehypeBlock = (opts) => {
   const defaultOptions = {
      blockSymbol: ':::',
      classSymbol: ':',
      prefixClassWithBlockSymbol: false,
      wrapperTag: null,
   }
   const options = { ...defaultOptions, ...opts }
   return (tree) => {
      visit(
         tree,
         (node) => node.tagName === 'p',
         (node, index, parent) => {
            let start = null
            let end = null
            const pattern = new RegExp('^' + options.blockSymbol + '(.+)$')
            const matcher = toString(node).match(pattern)
            if (matcher) {
               const matching = matcher[1].split(options.classSymbol)
               const tag = matching[0]
               const className = matching[1] ? options.prefixClassWithBlockSymbol ? tag + matching[1] : matching[1] : null
               start = index
               let foundClosing = false
               const allAfter = findAllAfter(parent, index, (node) => {
                  if (toString(node) === options.blockSymbol) {
                     foundClosing = true
                  }
                  return !foundClosing
               })
               end = start + allAfter.length
               const wrapper = {
                  type: 'element',
                  tagName: tag,
                  properties: className != null ? { className: [className] } : {},
                  children: options.wrapperTag ? [{ type: 'element', tagName: options.wrapperTag, properties: {}, children: [...allAfter] }] : [...allAfter],
               }
               parent.children.splice(start, end - start + 2, wrapper)
            }
         }
      )
   }
}
export default rehypeBlock
