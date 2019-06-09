import Network from './lib/Network'

const svgContainer = document.getElementById('svgContainer')
const svgNS = 'http://www.w3.org/2000/svg'

const { height, width } = svgContainer.getBoundingClientRect()

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

const xOrNetwork = Network.createNetwork(2, 2, 3, 1)

const SVG = {
  createNeuron(id, cx, cy, r, activation, fill, stroke) {
    const circle = document.createElementNS(svgNS, 'circle')
    circle.setAttributeNS(null, 'id', id)
    circle.setAttributeNS(null, 'cx', cx + r)
    circle.setAttributeNS(null, 'cy', cy + r)
    circle.setAttributeNS(null, 'r', r)
    circle.setAttributeNS(null, 'fill', fill)
    circle.setAttributeNS(null, 'stroke', stroke)
    circle.setAttributeNS(null, 'stroke-width', '2')
    svgContainer.appendChild(circle)
    const text = this.createText(id + 't', cx + r - 20, cy + r, activation, '#000000')
    return { circle, text }
  },
  createWeight(id, x1, y1, x2, y2, width, color) {
    const line = document.createElementNS(svgNS, 'line')
    line.setAttributeNS(null, 'id', id)
    line.setAttributeNS(null, 'x1', x1)
    line.setAttributeNS(null, 'x2', x2)
    line.setAttributeNS(null, 'y1', y1)
    line.setAttributeNS(null, 'y2', y2)
    line.setAttributeNS(
      null,
      'style',
      'stroke:' + color + ';stroke-width:' + width
    )
    svgContainer.appendChild(line)
    return line
  },
  createText(id, x, y, text, color) {
    const textSVG = document.createElementNS(svgNS, 'text')
    textSVG.setAttributeNS(null, 'id', id)
    textSVG.setAttributeNS(null, 'x', x)
    textSVG.setAttributeNS(null, 'y', y)
    console.log('text:', text)
    textSVG.innerHTML = text.toString()
    textSVG.setAttributeNS(null, 'fill', color)
    svgContainer.appendChild(textSVG)
    return textSVG
  }
}

const drawNeuron = (id, x, y, r, activation) =>
  SVG.createNeuron(id, x, y, r, activation, 'white', 'black')

const drawWeight = (id, x1, y1, x2, y2, weight, color) =>
  SVG.createWeight(id, x1, y1, x2, y2, weight, color)

// Padding between neurons is circle's radius

const maxNeurons = xOrNetwork.layers.reduce((acc, l) =>
  acc > l.size ? acc : l.size
)

const config = {
  nR: height / (maxNeurons * 2 - 1) / 2,
  wOffset: width / xOrNetwork.layers.length / 2,
  hOffset: l => height / l.size / 2
}

for (let i = 1; i < xOrNetwork.layers.length; i++)
  xOrNetwork.layers[i].neurons.forEach((n, N) => {
    n.leftAxons.forEach((axon, A) => {
      console.log(axon.weight)
      drawWeight(
        'w' + i + N + (i - 1) + A,
        config.wOffset + 2 * config.wOffset * i,
        config.hOffset(xOrNetwork.layers[i]) +
          2 * config.hOffset(xOrNetwork.layers[i]) * N,
        config.wOffset + 2 * config.wOffset * (i - 1),
        config.hOffset(xOrNetwork.layers[i - 1]) +
          2 * config.hOffset(xOrNetwork.layers[i - 1]) * A,
        axon.weight.value === 0 ? 1 : Math.abs(axon.weight.value),
        axon.weight.value === 0
          ? 'black'
          : axon.weight.value > 0
          ? 'green'
          : 'red'
      )
    })
  })
xOrNetwork.layers.forEach((l, L) => {
  l.neurons.forEach((n, N) => {
    drawNeuron(
      'n' + L + N,
      config.wOffset - config.nR + 2 * config.wOffset * L,
      config.hOffset(l) - config.nR + 2 * config.hOffset(l) * N,
      config.nR,
      n.value.toFixed(3)
    )
  })
})
xOrTrainData.forEach(sample => {
  xOrNetwork.trainSample(sample)
  // draw NN here
  xOrNetwork.layers.forEach((l, L) => {
    l.neurons.map((n, N) => {
      const obj = document.getElementById('nt' + L + N)
      obj.innerText = n.value
    })
  })
  for (let i = 1; i < xOrNetwork.layers.length; i++)
    xOrNetwork.layers[i].neurons.forEach((n, N) => {
      n.leftAxons.forEach((axon, A) => {
        const obj = document.getElementById('w' + i + N + (i - 1) + A)
        obj.style.stroke =
          axon.weight.value === 0
            ? 'black'
            : axon.weight.value > 0
            ? 'green'
            : 'red'
        obj.style['stroke-width'] = axon.weight === 0 ? 1 : axon.weight
      })
    })
})
