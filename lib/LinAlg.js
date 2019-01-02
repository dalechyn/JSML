const sigmoid = x => 1 / (1 + Math.pow(Math.E, -x))
const dsigmoid = x => sigmoid(x) * (1 - sigmoid(x))
const randomRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

module.exports = {
  dsigmoid,
  sigmoid,
  randomRange
}