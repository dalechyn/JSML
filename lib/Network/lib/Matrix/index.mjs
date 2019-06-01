import Validator from './Validator'
import Math from '../Math/index'
/*
  Every function returns this in the end so keep the chaining possible
 */
const multiplyRouter = {
  object: function(m) {
    Validator.validateMultiply(this, m)
    return Matrix.createMatrix(
      this.rows,
      m.cols,
      this.data.map((row, i) =>
        Array.from(new Array(m.cols), () =>
          Array.from(m.data, (val, k) => row[k] * m.data[k][i]).reduce(
            (acc, val) => acc + val
          )
        )
      )
    )
  },
  number: function(x) {
    this.data.map(row => row.forEach(col => col * x))
    return this
  }
}

const Matrix = {
  MatrixFunc: {
    multiply: function(obj) {
      return multiplyRouter[typeof obj](obj)
    },
    add: function(m) {
      Validator.validateAddition(this, m)
      this.data.map((row, i) => row.map((el, j) => el + m.data[i][j]))
      return this
    }
  },
  createMatrix: function(rows, cols, data) {
    const Matrix = {
      rows: rows,
      cols: cols,
      data:
        data ||
        Array.from(new Array(rows), () => Array.from(new Array(cols), () => 0))
    }
    Validator.validateMatrix(Matrix)
    return Object.assign(Matrix, Matrix.MatrixFunc)
  },
  randomMatrix: function(rows, cols) {
    return Matrix.createMatrix(
      rows,
      cols,
      Array.from(new Array(rows), () =>
        Array.from(new Array(cols), () => Math.randomRange(-10, 10))
      )
    )
  }
}

export default Matrix
