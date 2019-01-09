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

function Network(inputLayer, outputLayerSize, hiddenLayersCount, hiddenLayersSize) {
  const activate = (weights, neurons, bias) => {
    let m = weights.multMatrix(neurons)
    return m.data[0][0] + bias[0]
  }

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
    const CtoAj = (k, layers, l) =>
      layers[l + 1]
        ? Array.from(
            layers[l + 1].weights.data,
            (rowWeights, j) =>
              rowWeights[k] *
              LinAlg.dsigmoid(
                activate(
                  new Matrix(1, layers[l].weights.data[k].length, [layers[l].weights.data[k]]),
                  layers[l].neurons,
                  layers[l].biases.data[k]
                )
              ) *
              CtoAj(j, layers, l + 1)
          ).reduce((acc, val) => acc + val)
        : 2 * (layers[l].neurons.data[k][0] - trainData.expect[k])

    let costGradient = {
      weights: [],
      biases: []
    }

    this.layers
      .slice(1) // slicing because first layer has no weights
      .map((layer, l, sliced) => {
        layer.weights.data.map((row, j) =>
          row.map((col, k) => {
            costGradient.biases.push(
              LinAlg.dsigmoid(
                activate(
                  new Matrix(1, sliced[l].weights.data[j].length, [sliced[l].weights.data[j]]),
                  sliced[l].neurons,
                  sliced[l].biases.data[j]
                ) * CtoAj(j, sliced, l)
              )
            )
            costGradient.weights.push(
              this.layers[l].neurons.data[k][0] * costGradient.biases[j * row.length + k]
            )
          })
        )
      })

    let pos = 0
    this.layers = [this.layers[0]].concat(
      this.layers.slice(1).map((layer, l) => {
        layer.weights.data.map((row, i) =>
          row.map(
            (col, j) =>
              col +
              costGradient.weights[pos++]
          )
        )
        layer.biases.data.map((row, i) =>
          row.map(
            (col, j) =>
              col +
              costGradient.biases[pos++]
          )
        )
        return layer
      })
    )
  }
}

let network = new Network(new InputLayer(new Matrix(6, 1, [[1], [0], [0], [1], [0], [0]])), 2, 3, 3)
console.log(network)
console.log(network.train({ expect: [0, 1, 0] })) // TODO : check how it works
