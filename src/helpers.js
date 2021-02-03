/**
 * Simple clone
 * @param obj
 * @returns {any}
 */
export function cloneDeep (obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Get vue-complient options from node attributes
 * @param node
 * @returns {{style: String, class: String, attrs: Object}}
 */
export function getOptionsFromNode(node) {
  let attrs = cloneDeep(node.attrs)
  const c = node.attrs?.class
  const style = node.attrs?.style
  delete attrs.style
  delete attrs.class
  return {
    style,
    attrs,
    class: c
  }
}