import Network from './lib/Network'
import Matrix from './lib/Network/lib/Matrix'

let network = Network.createNetwork(
  Network.createInLayer(
    Matrix.createMatrix(6, 1, [[1], [0], [0], [1], [0], [0]])
  ),
  2,
  3,
  3
)
console.dir(network)
console.log(network.train({ expect: [0, 1, 0] })) // TODO : check how it works
