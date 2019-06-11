import Network from './lib/Network'
import Renderer from './lib/Network/Renderer'

function shuffle(array) {
  let counter = array.length

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter)

    // Decrease counter by 1
    counter--

    // And swap the last element with it
    let temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }

  return array
}

// Learning XOR ^_^
const xOrTrainData = shuffle([
  ...Array.from(Array(2300), () => ({
    data: [0, 1],
    expect: [1]
  })),
  ...Array.from(Array(2300), () => ({
    data: [0, 0],
    expect: [0]
  })),
  ...Array.from(Array(2300), () => ({
    data: [1, 0],
    expect: [1]
  })),
  ...Array.from(Array(2300), () => ({
    data: [1, 1],
    expect: [0]
  }))
])

const xOrNetwork = Network.createNetwork(2, 1, 5, 1)
// xOrNetwork.train(xOrTrainData)

const hOsNetwork = Network.createNetwork(6, 2, 5, 2)
/*
  Here we feed NN with array size of 6, where first three elements are
  rock, paper, scissors player1,
  and second three rock, paper, scissors player2

  We will get [1, 0] if player1 win's, [1, 1] if it's a tie, [0, 1] if
  player2 wins
*/
const hOsTrainData = shuffle([
  ...Array.from(Array(3000), () => ({
    data: [1, 0, 0, 1, 0, 0],
    expect: [1, 1]
  })),
  ...Array.from(Array(3000), () => ({
    data: [0, 1, 0, 1, 0, 0],
    expect: [1, 0]
  })),
  ...Array.from(Array(3000), () => ({
    data: [0, 0, 1, 1, 0, 0],
    expect: [0, 1]
  })),
  ...Array.from(Array(3000), () => ({
    data: [1, 0, 0, 0, 1, 0],
    expect: [0, 1]
  })),
  ...Array.from(Array(3000), () => ({
    data: [1, 0, 0, 0, 0, 1],
    expect: [1, 0]
  })),
  ...Array.from(Array(3000), () => ({
    data: [0, 1, 0, 0, 1, 0],
    expect: [1, 1]
  })),
  ...Array.from(Array(3000), () => ({
    data: [0, 0, 1, 0, 0, 1],
    expect: [1, 1]
  }))
])

Renderer.render(
  document.getElementById('NNContainer'),
  xOrNetwork,
  xOrTrainData
)
