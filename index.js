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
  const activate = (weights, neurons, bias) => weights
    .multiply(neurons).data[0][0] + bias

  this.train = function(trainData) {
    const CtoAj = (k, layers, l) => (layers[l + 1] ? Array.from(layers[l + 1], (layer, j) => layer.weights[k][j] * LinAlg.dsigmoid(// k j or j k TODO: test
      activate(new Matrix(1, layers[l].weights.data.length, [
        layers[l].weights.data[j][k]
      ]), new Matrix(layers[l].neurons.data.length, 1, Array.from(
        this.layers[l].neurons.data[j],
        x => [x]
      )))) * CtoAj(j, layers, l + 1)).reduce((acc, val) => acc + val) : 2 * (layers[l].neurons.data[k][0] - trainData.expect[k]))

    let costGradient = []
    Array.from(this.layers)
      .reverse()
      .forEach((layer, L) => {
        layer.neurons.data.forEach((row, i) => {
          costGradient.weights.push(row[0] * LinAlg.dsigmoid(activate(new Matrix(
            1,
            this.layers[L - 1].weights.data.length,
            [this.layers[L - 1].weights.data[i]]
          ), new Matrix(this.layers[L - 1].neurons.data.length, 1, Array.from(
            this.layers[L - 1].neurons.data[i],
            x => [x]
          )), this.layers[L - 1].biases[i]) * CtoAj(i, this.layers, L + 1)))
        })
      })
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
