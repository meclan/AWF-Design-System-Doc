/**
 * Token resolver — transforms raw Tokens Studio JSON into flat key→value maps.
 *
 * The source JSON files in source/ are NEVER edited manually.
 * When Figma tokens update: replace source/ files only.
 * When token structure changes: update this file.
 */

/**
 * Flatten a nested token object into a dot-notation map.
 * e.g. { color: { neutral: { 50: { $value: "#fff" } } } }
 *   → { "color.neutral.50": "#fff" }
 * Skips $extensions and $type, only captures $value.
 */
export function flattenTokens(obj, prefix = '') {
  const result = {}
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue
    const path = prefix ? `${prefix}.${key}` : key
    if (val && typeof val === 'object' && '$value' in val) {
      result[path] = val.$value
    } else if (val && typeof val === 'object') {
      Object.assign(result, flattenTokens(val, path))
    }
  }
  return result
}

/**
 * Resolve a single value that may contain a {reference}.
 * References can be nested: {color.brand.DOT.600}
 * Falls back to the raw string if not found.
 */
export function resolveValue(value, flatMap, maxDepth = 8) {
  if (typeof value !== 'string') return value
  const match = value.match(/^\{(.+)\}$/)
  if (!match) return value
  const ref = match[1]
  const resolved = flatMap[ref]
  if (resolved === undefined) return value
  if (maxDepth > 0) return resolveValue(resolved, flatMap, maxDepth - 1)
  return resolved
}

/**
 * Fully resolve all values in a flat token map.
 * Handles chained references (semantic → primitive → hex).
 */
export function resolveAll(flatMap) {
  const resolved = {}
  for (const [key, value] of Object.entries(flatMap)) {
    resolved[key] = resolveValue(value, flatMap)
  }
  return resolved
}

/**
 * Build a merged flat map from primitives + one semantic theme,
 * then resolve all references to hex values.
 *
 * @param {object} primitivesJson  — raw Primitives-tokens.json
 * @param {object} semanticJson    — raw semantic theme JSON (e.g. DOT-Light.json)
 * @returns {{ primitives: object, semantic: object }} — resolved flat maps
 */
export function buildThemeMap(primitivesJson, semanticJson) {
  const flatPrimitives = flattenTokens(primitivesJson)
  const flatSemantic   = flattenTokens(semanticJson)

  // Merged lookup: semantic references resolve against primitives
  const merged = { ...flatPrimitives, ...flatSemantic }

  return {
    primitives: resolveAll(flatPrimitives),
    semantic:   resolveAll(merged),
  }
}

/**
 * Extract a palette (steps 50–950) from a resolved primitives map.
 * e.g. getPalette(resolved, "color.brand.DOT") → [{ step: "50", value: "#..." }, ...]
 */
export function getPalette(resolvedPrimitives, path) {
  const steps = ['50','100','200','300','400','500','600','700','800','900','950']
  return steps
    .map(step => ({ step, value: resolvedPrimitives[`${path}.${step}`] }))
    .filter(s => s.value !== undefined)
}
