const apiModuleFiles = require.context('./modules', true, /\.js$/)
const apiModule = apiModuleFiles.keys().reduce((module, path) => {
  const modulesName = path.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = apiModuleFiles(path)
  module[modulesName] = value.default
  return module
}, {})

export default apiModule
