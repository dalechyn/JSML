import Network from './lib/Network'
import MMath from './lib/Network/lib/Math'

const canvasContainer = document.getElementById('canvasContainer')

const { height, width } = canvasContainer

const ctx = canvasContainer.getContext('2d')

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

const rgb = (red, green, blue) =>
  '#' +
  (0x1000000 + blue + 0x100 * green + 0x10000 * red).toString(16).substr(1)

const canvasFunc = {
  createNeuron(cx, cy, r, activation, bias) {
    ctx.beginPath()
    ctx.fillStyle = rgb(
      128 - Math.round(127 * MMath.mSigmoid(bias)),
      128 + Math.round(127 * MMath.mSigmoid(bias)),
      0
    )
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 3
    ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()
    this.createText(cx + r, cy + r, activation, '#FFFFFF')
  },
  createWeight(x1, y1, x2, y2, weight) {
    ctx.beginPath()
    ctx.strokeStyle = weight > 0 ? 'lime' : 'red'
    const drawWidth = 5 * MMath.sigmoid(weight)
    ctx.lineWidth = drawWidth < 1 ? 1 : drawWidth
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  },
  createText(x, y, text, color) {
    ctx.beginPath()
    ctx.font = '20px Arial'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(text, x, y)
  }
}

const maxNeurons = hOsNetwork
  .getLayers()
  .reduce((acc, l) => (acc > l.size ? acc : l.size))

const drawNN = network => {
  const config = {
    nR: height / (maxNeurons * 2 - 1) / 2,
    wOffset: width / network.getLayers().length / 2,
    hOffset: l => height / l.size / 2
  }
  for (let i = 1; i < network.getLayers().length; i++)
    network.getLayers()[i].neurons.forEach((n, N) => {
      n.leftAxons.forEach((axon, A) => {
        canvasFunc.createWeight(
          config.wOffset + 2 * config.wOffset * i,
          config.hOffset(network.getLayers()[i]) +
            2 * config.hOffset(network.getLayers()[i]) * N,
          config.wOffset + 2 * config.wOffset * (i - 1),
          config.hOffset(network.getLayers()[i - 1]) +
            2 * config.hOffset(network.getLayers()[i - 1]) * A,
          axon.weight.value
        )
      })
    })
  network.getLayers().forEach((l, L) => {
    l.neurons.forEach((n, N) => {
      canvasFunc.createNeuron(
        config.wOffset - config.nR + 2 * config.wOffset * L,
        config.hOffset(l) - config.nR + 2 * config.hOffset(l) * N,
        config.nR,
        n.value.toFixed(3),
        n.bias
      )
    })
  })

  canvasFunc.createText(
    width - 100,
    50,
    'Generation: ' + network.getGeneration(),
    '#000000'
  )
}

drawNN(hOsNetwork)

console.log(hOsNetwork.getLayers())

document.getElementById('startButton').onclick = () => {
  hOsTrainData.forEach(sample =>
    setTimeout(() => {
      hOsNetwork.trainSample(sample)
      ctx.clearRect(0, 0, width, height)
      drawNN(hOsNetwork)
    }, 0)
  )
}
