# What does it do
This small library takes a well-formed HTML and transforms into vue render functions, while also giving you the possibility to swap in some vue components in place of HTML nodes.

# Why has it been made
To solve a basic problem: what if you need to, for example, substitute an anchor tag coming from your headless CMS of choice and transform it into your own `Cta.vue` element?

Of course there are many ways to do that, for example you could leverage `<component :is="{ template: ... }">` power, but this requires the full Vue build (which is 30% bigger), and pull a lot of unnecessary things in. This library is just 5.11KB (~2KB gzipped).

# Drawbacks
Html needs to be well-formed. This library uses [html-parse-stringify](https://github.com/HenrikJoreteg/html-parse-stringify), which is super small, but requires to have well formed HTML.

> Note: HTML entities are not parsed. Therefore, HTML entities parsing has to be handled beforehand.

# How to use it

### Install it
`npm install --dev html-to-vue` or `yarn add --dev html-to-vue`

### Use it like this in a template-less vue component
```js
    import { renderHtml } from 'vue-to-html';
    export default {
	    data: () => ({
			config: { ... },
			rawHtml: '<div> Hello world! </div>'
		}),
		render (createElement) {
			return renderHtml(this.rawHtml, this.config, createElement)
		}
	}
```
### Configuration
Below is the default configuration, which you can override
```js
	{  
	  // This object sets up the container of the HTML that gets rendered
	  container: {
	    type: 'div',  
		config: {  // this config is compliant with with Vue's createElement config
		  class: 'rendered-html'  
		}  
	  },  
	  // This object contains Vue components that substitutes HTML node (look at next section)
	  extraComponentsMap: {},  
	  /* By default, if there are no extraComponents in the HTML to substitute,
	   html-to-vue will not use render functions.
	   It will just put the HTML inside the container provided, as if it would be a v-html directive. 
	   If you want to render everything as a render function anyway set this to true */
	  renderAnyway: false,  
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
				const text = children[0]; // let's pretend anchor in our case has only a text-node child
		<div class="button">
			<slot/>
		</div>
	</template>
	<script>
		export default {
			
		}
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
			renderer(node, children, createElement) {
				return createElement(
					Button,
					{
						class: node.attrs?.class, // if we want to pass the class of the node
						attrs: {
							target: node.attrs?.target // target
						}
					},
					[...children] // parsed children, in our case it will probably be just a text child
			}
		} 
	}
```
