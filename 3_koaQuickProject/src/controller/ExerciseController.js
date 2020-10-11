const fs = require('fs')
const path = require('path')

class ExerciseController {
  static getPicArr () {
    const arrPath = path.resolve(__dirname, '../mock/picArr.json')
    return JSON.parse(fs.readFileSync(arrPath))
  }
}

module.exports = {
  ExerciseController
}
