import Validator from '../Validator/index.mjs'
import Math from '../Math/index.mjs'
/*
  Every function returns this in the end so keep the chaining possible
*/
const multiplyRouter = {
  object(m1, m2) {
    Validator.validateMultiply(m1, m2)
    return Matrix.createMatrix(
      m1.rows,
      m2.cols,
      m1.data.map((row, i) =>
        Array.from(new Array(m2.cols), () =>
          Array.from(m2.data, (val, k) => row[k] * m2.data[k][i]).reduce(
            (acc, val) => acc + val
          )
        )
      )
    )
  },
  number: (m, x) => Matrix.from(m, el => el * x)
}

const Matrix = {
  createMatrix(
    rows,
    cols,
    data = Array.from(new Array(rows), () =>
      Array.from(new Array(cols), () => 0)
    )
  ) {
    const newMatrix = {
      rows,
      cols,
      data,
      multiply(obj) {
        return multiplyRouter[typeof obj](this, obj)
      },
      add(m) {
        Validator.validateAddition(this, m)
        return Matrix.createMatrix(
          m.rows,
          m.cols,
          data.map((row, i) => row.map((el, j) => el + m.data[i][j]))
        )
      },
      map(mapFn) {
        const m = Matrix.from(this)
        m.data = m.data.map(row => row.map(mapFn))
        return m
      }
    }
    Validator.validateMatrix(newMatrix)
    return newMatrix
  },
  randomMatrix: (rows, cols) =>
    Matrix.createMatrix(rows, cols).map(() => Math.randomRange(-10, 10)),

  from(m, mapFn = null) {
    let matrix = Matrix.createMatrix(m.rows, m.cols, m.data)
    if (mapFn) matrix = matrix.map(mapFn)
    return matrix
  }
}

export default Matrix
