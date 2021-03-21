# What does it do

This small library takes a well-formed HTML and transforms into vue render functions, while also giving you the possibility to swap in some vue components in place of HTML nodes.

# Why has it been made

To solve a basic problem: what if you need to, for example, substitute an anchor tag coming from your headless CMS of choice and transform it into your own `Cta.vue` element?

Of course there are many ways to do that, for example you could leverage `<component :is="{ template: ... }">` power, but this requires the full Vue build (which is 30% bigger), and pull a lot of unnecessary things in. This library is just ~4KB (~2KB gzipped).

# Drawbacks

Html needs to be well-formed. This library uses [html-parse-stringify](https://github.com/HenrikJoreteg/html-parse-stringify), which is super small, but requires to have well formed HTML.

> Note: HTML entities are not parsed. Therefore, HTML entities parsing has to be handled beforehand.

# How to use it

### Install it

`npm install --dev html-to-vue` or `yarn add --dev html-to-vue`

### Use it like this in a functional vue component

```js
    import { renderHtml } from 'vue-to-html';
    export default {
		functional: true,
	    data: () => ({
			config: { ... },
			rawHtml: '<div> Hello world! </div>'
		}),
		render (h, context) {
			return renderHtml(this.rawHtml, this.config, h, context)
		}
	}
```

### Configuration

Below is the default configuration, which you can override

```js
	{
	  // This object sets up the container of the HTML that gets rendered
	  container: {
	    type: 'div'
	  },
	  // This object contains Vue components that substitutes HTML node (look at next section)
	  extraComponentsMap: {},
	  /*
	   You can conditionally pass a function which transform text Nodes (e.g.: to handle html entities)
	   */
	  textTransformer: text => text
	}
```

### extraComponentsMap

`extraComponentsMap` contains objects with two callbacks: `conditions` and `renderer`.

- `conditions(node)` should return whether a node has to be swapped or not
- `renderer(node, children, createElement)` renders the vue component.

For example, let's say we need to transform each anchor with `class="btn"` into our own `Button.vue` component, our `extraComponentsMap`object will look like this:

**Button.vue**:

```html
<template>
  <div class="button">
    <slot />
  </div>
</template>
<script>
  export default {};
</script>
```

```js
	extraComponentsMap: {
		customButtonConfig: {
			conditions(node) {
				return (
					node.type === 'tag' && // is a tag
					node.name === 'a' && // is an anchor
					node.attrs?.class?.match(/btn\s?/) // has btn class
				)
			},
			renderer(node, children, createElement, context) {
			    const options = getOptionsFromNode(node)
				return createElement(
					Button,
					{
						class: options.class,
						attrs: options.attrs,
						style: options.style,
						on: {
							click: () => {
								const emit_event = context.listeners['click'];
								emit_event("Hello world!");
							}
						}
					},
					[...children] // parsed children, in our case it will probably be just a text child
			}
		}
	}
```

### Helper functions

- `getOptionsFromNode(node)`:
  This function takes in a node and spits out an object that matches vue-compliant options from the node attributes
