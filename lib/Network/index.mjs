import Lib from './lib'

const { Matrix, Math, Validator } = Lib

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
  createLayerPair: (l1, l2) => ({
    first: l1,
    second: l2,
    weights: Matrix.randomMatrix(l2.neurons.rows, l1.neurons.rows),
    biases: Matrix.randomMatrix(l2.neurons.rows, 1)
  }),
  createLayer: neurons => ({ neurons }),
  createNetwork: function(
    inLayer,
    outLayerSize,
    hidLayersCount,
    hidLayersSize
  ) {
    const costGradient = {
      weights: [],
      biases: []
    }

    const layers = [
      inLayer,
      ...Array.from(new Array(hidLayersCount), () =>
        Network.createLayer(Matrix.randomMatrix(hidLayersSize, 1))
      ),
      Network.createLayer(Matrix.randomMatrix(outLayerSize, 1))
    ]

    const layerPairs = Array.from(layers.slice(0, -1), (layer, i) =>
      Network.createLayerPair(layer, layers[i + 1])
    )

    return {
      layers,
      layerPairs,
      train: function(trainData) {
        // Validate trainData
        Validator.validateTrainData(trainData)
        // Iterating the last pair of layers
        // layerPairs[layerPairs.length - 1].weights.data.map(w => w + )

        /*        this.layerPairs.map((pair) => {
          pair.weights.data.map((row, j) =>
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
        ) */
      }
    }
  }
}

export default Network
