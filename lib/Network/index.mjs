import Lib from './lib'

const { Matrix, Math } = Lib

const activate = (weights, neurons, bias) => {
  let m = weights.multiply(neurons)
  return m.data[0][0] + bias[0]
}

const CtoAj = (k, layers, l, trainData) =>
  layers[l + 1]
    ? Array.from(
        layers[l + 1].weights.data,
        (rowWeights, j) =>
          rowWeights[k] *
          Math.dSigmoid(
            activate(
              Matrix.createMatrix(1, layers[l].weights.data[k].length, [
                layers[l].weights.data[k]
              ]),
              layers[l].neurons,
              layers[l].biases.data[k]
            )
          ) *
          CtoAj(j, layers, l + 1)
      ).reduce((acc, val) => acc + val)
    : 2 * (layers[l].neurons.data[k][0] - trainData.expect[k])

const Network = {
  createInLayer: neurons => ({ neurons }),
  createHidLayer: (neurons, weights, biases) => ({ neurons, weights, biases }),
  createOutLayer: (size, weights, biases) => ({
    neurons: Matrix.createMatrix(size, 1),
    weights,
    biases
  }),
  createNetwork: function(
    inLayer,
    outLayerSize,
    hidLayersCount,
    hidLayersSize
  ) {
    let prevLayer = inLayer

    const costGradient = {
      weights: [],
      biases: []
    }

    return {
      layers: [
        inLayer,
        ...Array.from(new Array(hidLayersCount), () => {
          return (prevLayer = Network.createHidLayer(
            Matrix.randomMatrix(hidLayersSize, 1),
            Matrix.randomMatrix(hidLayersSize, prevLayer.neurons.data.length),
            Matrix.randomMatrix(hidLayersSize, 1)
          ))
        }),
        Network.createOutLayer(
          outLayerSize,
          Matrix.randomMatrix(outLayerSize, prevLayer.neurons.data.length),
          Matrix.randomMatrix(outLayerSize, 1)
        )
      ],
      train: function(trainData) {
        this.layers
          .slice(1) // slicing because first layer has no weights
          .map((layer, l, sliced) => {
            layer.weights.data.map((row, j) =>
              row.map((col, k) => {
                costGradient.biases.push(
                  Math.dSigmoid(
                    activate(
                      Matrix.createMatrix(1, sliced[l].weights.data[j].length, [
                        sliced[l].weights.data[j]
                      ]),
                      sliced[l].neurons,
                      sliced[l].biases.data[j]
                    ) * CtoAj(j, sliced, l, trainData)
                  )
                )
                costGradient.weights.push(
                  this.layers[l].neurons.data[k][0] *
                    costGradient.biases[j * row.length + k]
                )
              })
            )
          })

        let pos = 0

        this.layers = [this.layers[0]].concat(
          this.layers.slice(1).map(layer => {
            layer.weights.data.map(row =>
              row.map(col => col + costGradient.weights[pos++])
            )
            layer.biases.data.map(row =>
              row.map(col => col + costGradient.biases[pos++])
            )
            return layer
          })
        )
      }
    }
  }
}

export default Network
