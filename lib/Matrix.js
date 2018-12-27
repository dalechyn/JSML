function Matrix(rows, cols) {
  this.rows = rows
  this.cols = cols

  this.data =
    arguments[2] ||
    Array.from(new Array(rows), () => Array.from(new Array(cols), () => 0))

  this.multiply = function(matrix) {
    if (cols === matrix.rows)
      return this.data.map((row, i) =>
        row.map((col, j) =>
          Array.from(
            new Array(cols),
            (cur, k) => this.data[i][k] * matrix.data[k][j]
          ).reduce((ac, el) => ac + el)
        )
      )
  }

  this.add = function add(matrix) {
    if (cols === matrix.cols && rows === matrix.rows)
      return this.data.map((row, i) =>
        row.map((el, j) => el + matrix.data[i][j])
      )
  }
}

module.exports = Matrix
