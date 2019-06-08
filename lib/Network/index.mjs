import Lib from './lib'

const { Math, Validator } = Lib

const Network = {
  /*
    Neuron represents an activation value of range 0...1,
    activation bias and connection state
   */
  createNeuron: (value, bias = 0, leftAxons = [], rightAxons = []) => ({
    value,
    bias,
    leftAxons,
    rightAxons
  }),
  /*
    createNeuronPair connects two neurons and creates connection weight between
   */
  connectNeurons: (ny, nx, weightValue = Math.randomRange(-5, 5)) => {
    const weight = { value: weightValue }
    nx.rightAxons.push({ n: ny, weight })
    ny.leftAxons.push({ n: nx, weight })
  },
  /*
    Layer represents an array of neurons
   */
  createLayer: neurons => ({ neurons, size: neurons.length }),
  /*
    LayerPair represents two layer's which neuron's are connected to each other
    oneWeight defines the weight value neurons should be connected to each other
   */
  connectLayers: (lx, ly) => {
    ly.neurons.map(ny => lx.neurons.map(nx => Network.connectNeurons(ny, nx)))
  },
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
      Network.createLayer(
        Array.from(Array(inLayerSize), () => Network.createNeuron())
      ),
      ...Array.from(Array(hidLayersCount), () =>
        Network.createLayer(
          Array.from(Array(hidLayersSize), () =>
            Network.createNeuron(Math.random(), Math.randomRange(-5, 5))
          )
        )
      ),
      Network.createLayer(
        Array.from(Array(outLayerSize), () =>
          Network.createNeuron(Math.random(), Math.randomRange(-5, 5))
        )
      )
    ]

    const netInput = n =>
      n.leftAxons.reduce(
        (acc, nl) => acc + nl.weight.value * nl.n.value,
        n.bias
      )

    const process = initData => {
      Validator.validateInputData(initData, inLayerSize)
      // Setting initial neuron values
      layers[0].neurons.forEach((n, i) => {
        n.value = initData[i]
      })
      for (let i = 1; i < layers.length; i++)
        layers[i].neurons.forEach(n => {
          n.value = Math.sigmoid(netInput(n))
        })
      return layers[layers.length - 1].neurons.map(n => n.value)
    }

    // Connecting Layer neurons
    for (let i = 0; i < layers.length - 1; i++)
      Network.connectLayers(layers[i], layers[i + 1])

    let epoch = 0

    const train = function(trainData) {
      // Validate trainData
      Validator.validateTrainData(trainData)
      trainData.forEach(trainSample => {
        // Launching NN
        process(trainSample.data)
        /*
            Output layer backpropagation:

            errorGradient represents all the changes to the NN to be made,
            looks like this:
            [
              [...], - dLayer1
              [...], - dLayer2
              and so on...
            ]
            dLayer looks like this:
            [
              {
                dAct: ...,
                dWeights: [...],
                dBias: ...
              },
              and so on...
            ]
            So this way all the changes are stored in such format so we could
            evolve NN easily
          */
        const errorGradient = new Array(layers.length - 1)

        // eslint bug
        // eslint-disable-next-line standard/computed-property-even-spacing
        errorGradient[layers.length - 1] = layers[
          layers.length - 1
        ].neurons.map((n, i) => {
          const errToAct = n.value - trainSample.expect[i]
          const outToNet = Math.dSigmoid(netInput(n))
          return {
            dAct: errToAct,
            dOut: outToNet,
            dWeights: n.leftAxons.map(axon => ({
              axon,
              dWeight: errToAct * outToNet * axon.n.value
            })),
            dBias: errToAct * outToNet
          }
        })
        /*
            Hidden layers backpropagation

            Unfortunately here will be index chaos because I don't want NN to
            mutate with different thrash values, so it worth it
          */
        for (let l = layers.length - 2; l >= 0; l--) {
          errorGradient[l] = layers[l].neurons.map(n => {
            // Calculating right axons error der. to this neuron activation
            const errToAct = n.rightAxons.reduce((acc, axon, aI) => {
              const { dAct, dOut } = errorGradient[l + 1][aI]
              return acc + dAct * dOut * axon.weight.value
            }, 0)
            const outToNet = Math.dSigmoid(netInput(n))
            return {
              dAct: errToAct,
              dOut: outToNet,
              dWeights: n.leftAxons.map(axon => ({
                axon,
                dWeight: errToAct * outToNet * axon.n.value
              })),
              dBias: errToAct * outToNet
            }
          })
        }
        /*
          After we calculated errorGradient, we can finally apply it and
          evolve our NN
         */
        layers[0].neurons.forEach((n, N) => {
          n.bias -= errorGradient[0][N].dBias
        })
        for (let L = 1; L < layers.length; L++)
          layers[L].neurons.forEach((n, N) => {
            n.bias -= errorGradient[L][N].dBias
            n.leftAxons.forEach((axon, A) => {
              axon.weight.value -= errorGradient[L][N].dWeights[A].dWeight
            })
          })
        epoch++
      })
    }

    const print = () => {
      layers.forEach((l, L) => {
        console.log('layer' + L + ':')
        l.neurons.map((n, N) => console.log('\tn' + L + N, n.value))
      })
      console.log('weights:')
      for (let i = 1; i < layers.length; i++)
        layers[i].neurons.forEach((n, N) => {
          console.log('\tn' + i + N)
          n.leftAxons.forEach((axon, A) => {
            console.log('\t\t' + axon.weight.value, 'n' + (i - 1) + A)
          })
        })
    }

    return {
      epoch,
      layers,
      process,
      train,
      print
    }
  }
}

export default Network
