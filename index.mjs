import Network from './lib/Network'

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
const trainData = shuffle([
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

let network = Network.createNetwork(2, 1, 1, 5)
network.train(trainData)

console.log('xor(0, 0) =', network.process([0, 0])[0])
console.log('xor(0, 1) =', network.process([0, 1])[0])
console.log('xor(1, 0) =', network.process([1, 0])[0])
console.log('xor(1, 1) =', network.process([1, 1])[0])
