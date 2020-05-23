/**
 * simple is equal comparison
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */
function isEqual (obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

/**
 *
 * @param ast1
 * @param ast2
 * @returns {boolean}
 */
export function isAstDifferent (ast1, ast2) {
  return !isEqual(ast1, ast2)
}

export function cloneDeep (obj) {
  return JSON.parse(JSON.stringify(obj))
}
