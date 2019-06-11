import MMath from '../lib/Math'

const rgb = (red, green, blue) =>
  '#' +
  (0x1000000 + blue + 0x100 * green + 0x10000 * red).toString(16).substr(1)

const canvasFunc = ctx => ({
  createNeuron(cx, cy, r, activation, bias, zoom) {
    ctx.beginPath()
    ctx.fillStyle = rgb(
      128 - Math.round(127 * MMath.mSigmoid(bias)),
      128 + Math.round(127 * MMath.mSigmoid(bias)),
      0
    )
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 3
    ctx.arc(zoom * (cx + r), zoom * (cy + r), zoom * r, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()
    this.createText(cx + r, cy + r, activation, '#FFFFFF', zoom)
  },
  createWeight(x1, y1, x2, y2, weight, zoom) {
    ctx.beginPath()
    ctx.strokeStyle = weight > 0 ? 'green' : 'red'
    const drawWidth = Math.abs(5 * MMath.mSigmoid(weight))
    ctx.lineWidth = (drawWidth < 1 ? 1 : drawWidth) * zoom
    ctx.moveTo(zoom * x1, zoom * y1)
    ctx.lineTo(zoom * x2, zoom * y2)
    ctx.stroke()
  },
  createText(x, y, text, color, zoom) {
    ctx.beginPath()
    ctx.font = 20 * zoom + 'px Arial'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(text, zoom * x, zoom * y)
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
      8
    const width = network.getLayers().length * neuronRadius * 8
    const wOffset = neuronRadius * 4
    const hOffset = l => height / l.size / 2
    let zoom = 1

    DOMNetwork.height = height
    DOMNetwork.width = width

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
              axon.weight.value,
              zoom
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
            n.bias,
            zoom
          )
        })
      })
      DOMNetworkGen.innerText = 'Generation: ' + network.getGeneration()
      DOMNetworkGen.style.fontSize = 30 + 'px'
    }

    drawNN(network)

    const DOMUIContainer = document.createElement('div')
    DOMUIContainer.style.display = 'flex'

    let working = false

    let frameID = 0

    const repaint = gen => {
      network.trainSample(trainData[gen])
      ctx.clearRect(0, 0, width, height)
      drawNN(network)
    }

    const repaintLoop = () => {
      const gen = network.getGeneration()
      repaint(gen)
      if (gen < trainData.length)
        frameID = window.requestAnimationFrame(repaintLoop)
    }

    const startButton = document.createElement('button')
    startButton.innerText = 'Start Learning'
    startButton.onclick = () => {
      if (!working) {
        repaintLoop()
        working = true
      }
    }

    const stopButton = document.createElement('button')
    stopButton.innerText = 'Stop Learning'
    stopButton.onclick = () => {
      window.cancelAnimationFrame(frameID)
      working = false
    }

    const inputData = document.createElement('input')
    inputData.type = 'text'

    const feedButton = document.createElement('button')
    feedButton.innerText = 'Feed input'
    feedButton.onclick = () => {
      const input = inputData.value.split(',').map(el => Number(el.trim()))
      // checking for NaN's
      if (input.some(el => Number.isNaN(el)))
        window.alert('Input data is invalid')
      else
        try {
          window.alert(network.process(input))
        } catch (e) {
          window.alert(e)
        }
    }

    const zoomInButton = document.createElement('button')
    zoomInButton.innerText = 'Zoom in'
    zoomInButton.onclick = () => {
      if (zoom > 1) return
      zoom *= 2
      if (height * zoom * 2 > 1000 && width * zoom * 2 > 831) {
        DOMNetwork.height = height * zoom
        DOMNetwork.width = width * zoom
      }
      ctx.clearRect(0, 0, width, height)
      drawNN(network)
    }

    const zoomOutButton = document.createElement('button')
    zoomOutButton.innerText = 'Zoom out'
    zoomOutButton.onclick = () => {
      zoom = zoom < 0.0001 ? 0.0001 : zoom / 2
      if (
        DOMNetwork.height * (zoom / 2) > 1000 &&
        DOMNetwork.width * (zoom / 2) > 831
      ) {
        DOMNetwork.height = height * zoom
        DOMNetwork.width = width * zoom
      }
      ctx.clearRect(0, 0, width, height)
      drawNN(network)
    }

    const restartButton = document.createElement('button')
    restartButton.innerText = 'Restart Network'
    restartButton.onclick = () => {
      network.restart()
      ctx.clearRect(0, 0, width, height)
      drawNN(network)
      if (working) working = false
    }

    Array.of(
      startButton,
      stopButton,
      restartButton,
      inputData,
      feedButton,
      zoomInButton,
      zoomOutButton
    ).forEach(el => DOMUIContainer.appendChild(el))

    Array.of(DOMUIContainer, DOMNetworkGen, DOMNetwork).forEach(el =>
      DOMContainer.appendChild(el)
    )
  }
}

export default Renderer
