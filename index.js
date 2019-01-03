const { randomMatrix, LinAlg, Matrix } = require('./lib')

function InputLayer(neurons) {
  this.neurons = neurons
}

function HiddenLayer(neurons, weights, biases) {
  this.neurons = neurons
  this.weights = weights
  this.biases = biases
}

function OutputLayer(size, weights, biases) {
  this.neurons = new Matrix(size, 1)
  this.weights = weights
  this.biases = biases
}

function Network(
  inputLayer,
  outputLayerSize,
  hiddenLayersCount,
  hiddenLayersSize
) {
  const activate = (weights, neurons, bias) => {
    let m = weights
      .multiply(neurons)
    return m.data[0][0] + bias
  }

  // TODO: bias in constGradient, and TEST it
  let prevLayer = inputLayer
  this.layers = [inputLayer]
    .concat(
      Array.from(new Array(hiddenLayersCount), () => {
        prevLayer = new HiddenLayer(
          randomMatrix(hiddenLayersSize, 1),
          randomMatrix(hiddenLayersSize, prevLayer.neurons.data.length),
          randomMatrix(hiddenLayersSize, 1)
        )
        return prevLayer
      })
    )
    .concat(
      new OutputLayer(
        outputLayerSize,
        randomMatrix(outputLayerSize, prevLayer.neurons.data.length),
        randomMatrix(outputLayerSize, 1)
      )
    )

  this.train = function(trainData) {
    const CtoAj = (k, l) => (this.layers[l] ? Array.from(this.layers[l].weights.data, (layer, j) => layer.weights.data[j][k] * LinAlg.dsigmoid(// k j or j k TODO: test
      activate(new Matrix(1, this.layers[l].weights.data.length, [
        this.layers[l].weights.data[k]
      ]), this.layers[l].neurons,
      this.layers[l].biases.data[k]
      ))) * CtoAj(k, this.layers[l - 1]).reduce((acc, val) => acc + val) : 2 * (this.layers[l].neurons.data[k][0] - trainData.expect[k]))

    let costGradient = {
      weights:[],
      biases:[]
    }

    Array.from(this.layers)
      .reverse()
      .forEach((layer, L, reversed) => {
        layer.neurons.data.forEach((row, i) => {
          let smv = LinAlg.dsigmoid(activate(new Matrix(
            1,
            reversed[L + 1].weights.data.length,
            [reversed[L + 1].weights.data[i]]
          ), reversed[L + 1].neurons,
          reversed[L + 1].biases[i]) * CtoAj(i, reversed, L + 1))
          costGradient.weights.push(row[0] * smv)
        })
      })
  }
}


let network = new Network(
  new InputLayer(new Matrix(6, 1, [[1], [0], [0], [1], [0], [0]])),
  2,
  3,
  3
)
console.log(network)
console.log(network.train({expect: [
  0,
  1,
  0
]}))
