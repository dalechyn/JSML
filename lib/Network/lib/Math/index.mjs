const sigmoid = x => 1 / (1 + Math.pow(Math.E, -x))
const dSigmoid = x => sigmoid(x) * (1 - sigmoid(x))
const randomRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export default {
  dSigmoid,
  sigmoid,
  randomRange
}
