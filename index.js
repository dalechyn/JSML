'use strict'

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
  this.processLayer = prevLayer => prevLayer.weights
    .multiply(prevLayer.neurons.data)
    .add(prevLayer.biases.data)
    .data.map(row => LinAlg.sigmoid(row[0]))

  let prevLayer = inputLayer

  this.layers = [inputLayer].concat(Array.from(new Array(hiddenLayersCount), () => {
    prevLayer = new HiddenLayer(
      randomMatrix(hiddenLayersSize, 1),
      randomMatrix(
        hiddenLayersSize,
        prevLayer.neurons.data.length
      ),
    )
    return prevLayer
  })).concat(new OutputLayer(
    outputLayerSize,
    randomMatrix(
      outputLayerSize,
      prevLayer.neurons.data.length
    ),
    randomMatrix(outputLayerSize, 1)
  ))
}

console.log(
  new Network(new InputLayer(new Matrix(6, 1, [[1], [0], [0], [1], [0], [0]])), 2, 3, 3)
)
