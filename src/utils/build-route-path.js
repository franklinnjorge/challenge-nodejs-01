export function buildFunctionPath(path) {
   const routeParametersRegex = /:([a-zA-Z]+)/g
   const pathWIthPrams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9-\-_]+)')

   const pathRegex = new RegExp(`^${pathWIthPrams}(?<query>\\?(.*))?$`)

   return pathRegex
}