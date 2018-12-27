const Matrix = require('./Matrix')
const LinAlg = require('./LinAlg')

module.exports = {
  Matrix,
  LinAlg,
  randomMatrix: (rows, cols) =>
    new Matrix(
      rows,
      cols,
      Array.from(new Array(rows), () =>
        Array.from(new Array(cols), () => LinAlg.randomRange(-10, 10))
      )
    )
}
