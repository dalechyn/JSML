import Lib from './lib'

const { Math, Validator } = Lib

const Network = {
  /*
    Neuron represents an activation value of range 0...1,
    activation bias and connection state
   */
  createNeuron: (value, bias = 0) => ({ value, bias }),
  /*
    createNeuronPair connects two neurons and creates connection weight between
   */
  createNeuronPair: (nx, ny, weight = 0) => ({ nx, ny, weight }),
  /*
    Layer represents an array of neurons
   */
  createLayer: neurons => ({ neurons, size: neurons.length }),
  /*
    LayerPair represents two layer's which neuron's are connected to each other
    oneWeight defines the weight value neurons should be connected to each other
   */
  createLayerPair: (l1, l2, oneWeight = Math.randomRange(-10, 10)) => ({
    lx: l1,
    ly: l2,
    neuronPairs: l1.neurons.map(n1 =>
      l2.neurons.map(n2 => Network.createNeuronPair(n1, n2, oneWeight)).flat()
    )
  }),
  /*
    Network represents an array of layers and layerPairs with initializing and
    training functionality
   */
  createNetwork: function(
    inLayerSize,
    outLayerSize,
    hidLayersCount,
    hidLayersSize
  ) {
    const layers = [
      Network.createLayer(Array(inLayerSize).map(() => Network.createNeuron())),
      ...Array(hidLayersCount).map(() =>
        Network.createLayer(
          Array(hidLayersSize).map(() =>
            Network.createNeuron(
              Math.randomRange(-10, 10),
              Math.randomRange(-10, 10)
            )
          )
        )
      ),
      Network.createLayer(
        Array(outLayerSize).map(() =>
          Network.createNeuron(
            Math.randomRange(-10, 10),
            Math.randomRange(-10, 10)
          )
        )
      )
    ]

    const layerPairs = Array.from(layers.slice(0, -1), (layer, i) =>
      Network.createLayerPair(layer, layers[i + 1])
    )

    return {
      layers,
      layerPairs,
      init: initData => {
        Validator.validateInitData(initData, inLayerSize)
        layers[0].neurons.forEach((n, i) => {
          n.value = initData[i]
        })
      },
      train: function(trainData) {
        // Validate trainData
        Validator.validateTrainData(trainData)
        // Iterating the last pair of layers
        layerPairs[layerPairs.length - 1].neuronPairs.forEach(nPair => {
          /*
            Calculating derivative of weight value in respect to the Cost value
            and adding this to the weights on fly
           */
          /* nPair.weight +=
            nPair.nx *
            (nPair.weight * nPair.nx + nPair.ny.bias) *
            2 *
            (nPair.ny - trainData.) */
          // TODO: Think of the way of keeping track of expected trainData indexes
        })
      }
    }
  }
}

export default Network
