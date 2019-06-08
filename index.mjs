import Network from './lib/Network'

let network = Network.createNetwork(2, 1, 1, 3)
// Learning XOR ^_^
network.train([
  ...Array.from(Array(300), () => ({
    data: [0, 1],
    expect: [1]
  })),
  ...Array.from(Array(300), () => ({
    data: [0, 0],
    expect: [0]
  })),
  ...Array.from(Array(300), () => ({
    data: [1, 0],
    expect: [1]
  })),
  ...Array.from(Array(300), () => ({
    data: [1, 1],
    expect: [0]
  }))
])
console.log(network)
console.log(network.process([0, 1]))
console.log(network.process([1, 0]))
console.log(network.process([1, 1]))
