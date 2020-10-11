import http from '../axios'

class ExerciseApi {
  static getPicArr () {
    return http({
      url: '/exercise/pic'
    })
  }
}

export default ExerciseApi
