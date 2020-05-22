import { generateAST, rectifyAST } from "./src/ast";
import { isAstDifferent } from './src/helpers'
import { renderer } from "./src/renderer";

const defaultConfig = {
  container: {
    type: 'div',
    config: {
      class: 'rendered-html'
    }
  },
  extraComponentsMap: {},
  renderAnyway: false,
}

export function renderHtml (html, config, createElement) {
  const _c = Object.assign(defaultConfig, config)
  const _container = _c.container
  const _ast = generateAST(html)
  const _rectifiedAst = rectifyAST(_ast, config)
  const _hasAstChanged = isAstDifferent(_rectifiedAst, _ast)

  // html not yet provided/empty
  if (!html) {
    return createElement(_container.type, _container.config)
  }
  // no changes in AST and user doesn't want to leverage render functions anyway
  // works like a v-html
  if (!_hasAstChanged && !_c.renderAnyway) {
    const _vHtmlConfig = Object.assign(_c.container.config, { domProps: { innerHTML: html } })
    return createElement(_container.type, _vHtmlConfig)
  }

  // AST has changes, or user wants to leverage render functions
  return renderer(_rectifiedAst, _c, createElement)
}