# rehype-block

![Build][build-badge]

`rehype-block` is a [rehype][rehype] plugin to wrap a block of markdown with a HTML tag. So what is does in fact is simply replacing markdown lines like for example `:::aside` and `:::` with `<aside>` and `</aside>` respectively.

The opening block requires an appended name to be used for the HTML tag (see example below).

> [!NOTE]
> This plugin does in fact the same as the plugin [remark-directive](https://github.com/remarkjs/remark-directive) but is less generic which can be a better fit for certain markdown situations. If you need more flexibility, use `remark-directive` instead.

## Usage

Say we have the following markdown file `example.md`:

```markdown
# headline

:::aside

foo

:::

text

:::aside:aside-1

bar

:::
```

and a module `example.js`:

```js
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypeBlock from 'rehype-block'
import rehypeStringify from 'rehype-stringify'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import { read } from 'to-vfile'

const file = await remark()
   .use(remarkRehype)
   .use(rehypeBlock, { blockSymbol: ':::', classSymbol: ':' })
   .use(rehypeDocument)
   .use(rehypeFormat, { indent: '\t' })
   .use(rehypeStringify)
   .process(await read('example.md'))

console.log(file.value)
```

then running `node example.js` yields:

```html
<!doctype html>
<html lang="en">
   <head>
      <meta charset="utf-8" />
      <title>example</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
   </head>
   <body>
      <h1>headline</h1>
      <aside>
         <p>foo</p>
      </aside>
      <p>text</p>
      <aside class="aside-1">
         <p>bar</p>
      </aside>
   </body>
</html>
```

## Test

    npm run test

## API

The default export is `rehypeBlock`.

```js
unified().use(rehypeBlock, options)
```

### Options

The follwoing options are available:

-  `blockSymbol` (`string`, optional) — symbol to be used to define a block. Default is `:::`.

-  `classSymbol` (`string`, optional) — symbol to be used to separate an optional CSS class-name. Default is `:`.

-  `prefixClassWithBlockSymbol` (`Boolean`, optional) — prefix CSS class-name with block symbol. Default is `false`.

-  `wrapperTag` (`string`, optional) — tag name to be used to wrap the content of a block. Default is no wrapper tag.

[rehype]: https://github.com/rehypejs/rehype
[build-badge]: https://github.com/thomd/rehype-block/workflows/plugin-test/badge.svg
