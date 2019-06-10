import MMath from '../lib/Math'

const rgb = (red, green, blue) =>
  '#' +
  (0x1000000 + blue + 0x100 * green + 0x10000 * red).toString(16).substr(1)

const canvasFunc = ctx => ({
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
    ctx.strokeStyle = weight > 0 ? 'green' : 'red'
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
})

const Renderer = {
  render(DOMParent, network, trainData) {
    const DOMContainer = document.createElement('div')
    DOMParent.style.display = 'inline-block'
    DOMContainer.style.display = 'flex'
    DOMContainer.style.flexDirection = 'column'
    DOMParent.appendChild(DOMContainer)
    const DOMNetwork = document.createElement('canvas')
    const DOMNetworkGen = document.createElement('div')
    DOMNetworkGen.innerText = 'Generation: 0'
    DOMNetworkGen.style.textAlign = 'center'

    const neuronRadius = 50
    const height =
      network.getLayers().reduce((acc, l) => (acc > l.size ? acc : l.size)) *
      neuronRadius *
      4
    const width = network.getLayers().length * neuronRadius * 8
    const wOffset = neuronRadius * 4
    const hOffset = l => height / l.size / 2

    DOMNetwork.height = height
    DOMNetwork.width = width
    DOMContainer.appendChild(DOMNetworkGen)
    DOMContainer.appendChild(DOMNetwork)

    const ctx = DOMNetwork.getContext('2d')
    const ctxDrawer = canvasFunc(ctx)

    const drawNN = network => {
      for (let i = 1; i < network.getLayers().length; i++)
        network.getLayers()[i].neurons.forEach((n, N) => {
          n.leftAxons.forEach((axon, A) => {
            ctxDrawer.createWeight(
              wOffset + 2 * wOffset * i,
              hOffset(network.getLayers()[i]) +
                2 * hOffset(network.getLayers()[i]) * N,
              wOffset + 2 * wOffset * (i - 1),
              hOffset(network.getLayers()[i - 1]) +
                2 * hOffset(network.getLayers()[i - 1]) * A,
              axon.weight.value
            )
          })
        })
      network.getLayers().forEach((l, L) => {
        l.neurons.forEach((n, N) => {
          ctxDrawer.createNeuron(
            wOffset - neuronRadius + 2 * wOffset * L,
            hOffset(l) - neuronRadius + 2 * hOffset(l) * N,
            neuronRadius,
            n.value.toFixed(3),
            n.bias
          )
        })
      })
      DOMNetworkGen.innerText = 'Generation: ' + network.getGeneration()
    }

    drawNN(network)

    const DOMButtonsContainer = document.createElement('div')
    DOMButtonsContainer.style.display = 'flex'

    const working = true

    const startButton = document.createElement('button')
    startButton.innerText = 'Start Learning'
    startButton.onclick = () => {
      trainData.forEach(sample => {
        setTimeout(() => {
          network.trainSample(sample)
          ctx.clearRect(0, 0, width, height)
          drawNN(network)
        }, 0)
      })
    }
    const stopButton = document.createElement('button')
    stopButton.innerText = 'Stop Learning'
    stopButton.onclick = () => {}
    DOMButtonsContainer.appendChild(startButton)
    DOMButtonsContainer.appendChild(stopButton)
    DOMContainer.appendChild(DOMButtonsContainer)
  }
}

export default Renderer
