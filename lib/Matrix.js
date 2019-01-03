function Matrix(rows, cols) {
  this.rows = rows
  this.cols = cols

  this.data =
    arguments[2] || Array.from(new Array(rows), () => Array.from(new Array(cols), () => 0))

  // matrix validate
  if (this.data.length !== rows || !this.data.every(row => row.length === cols))
    throw new Error('Matrix data is not valid')

  this.multConst = function(x) {
    return new Matrix(this.rows, this.cols, this.data.map(row => row.forEach(col => col * x)))
  }

  this.multMatrix = function(matrix) {
    if (this.rows === matrix.cols) {
      return new Matrix(
        this.rows,
        matrix.cols,
        this.data.map((row, i) =>
          Array.from(new Array(matrix.cols), () =>
            Array.from(matrix.data, (val, k) => row[k] * matrix.data[k][i]).reduce(
              (acc, val) => acc + val
            )
          )
        )
      )
    } else throw new Error('Multiplication is impossible')
  }

  this.add = function add(matrix) {
    if (this.cols === matrix.cols && this.rows === matrix.rows)
      return new Matrix(
        this.rows,
        this.cols,
        this.data.map((row, i) => row.map((el, j) => el + matrix.data[i][j]))
      )
  }
}

module.exports = Matrix
