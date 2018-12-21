const randomRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const sigmoid = x => 1 / (1 + Math.pow(Math.E, -x));

function Matrix(rows, cols) {
  let args = [...arguments].slice(2);
  let data = [];

  if (args.length === 0) {
    for (let i = 0; i < rows; i++) {
      let filler = [];
      for (let j = 0; j < cols; j++) {
        filler.push(0);
      }
      data.push(filler);
    }
  } else {
    let z = 0;
    for (let i = 0; i < rows; i++) {
      let filler = [];
      for (let j = 0; j < cols; j++) {
        filler.push(args[z++]);
      }
      data.push(filler);
    }
  }

  function multiply(matrix) {
    if (cols !== matrix.rows) return;
    let result = [];
    for (let i = 0; i < rows; i++) {
      let filler = [];
      for (let j = 0; j < matrix.cols; j++) {
        let sum = 0;
        for (let k = 0; k < cols; k++) {
          sum += data[i][k] * matrix.data[k][j];
        }
        filler.push(sum);
      }
      result.push(filler);
    }
    return result;
  }

  function add(matrix) {
    if (cols !== matrix.cols || rows !== matrix.rows) return;
    let result = [];
    for (let i = 0; i < rows; i++) {
      let filler = [];
      for (let j = 0; j < cols; j++) {
        filler.push(data[i][j] + matrix.data[i][j]);
      }
      result.push(filler);
    }
    return result;
  }

  return {
    rows,
    cols,
    data,
    multiply,
    add
  };
}

function Neuron(value) {
  return {
    value
  };
}

function Layer() {
  return {
    neurons: null,
    weights: null,
    biases: null
  };
}

function InputLayer(neurons) {
  const layer = Layer();
  layer.neurons = neurons;
  return layer;
}

function HiddenLayer(neurons, weights, biases) {
  const layer = Layer();
  layer.neurons = neurons;
  layer.weights = weights;
  layer.biases = biases;
  return layer;
}

function OutputLayer(size, weights, biases) {
  const layer = Layer();
  layer.neurons = new Matrix(size, 1);
  layer.weights = weights;
  layer.biases = biases;
  return layer;
}

Layer.processLayer = prevLayer => {
  let ma = prevLayer.weights
    .multiply(prevLayer.neurons.data)
    .add(prevLayer.biases.data);
  ma.data.forEach((row, index) => {
    ma.data[index][0] = new Neuron(sigmoid(row[0]));
  });
  return ma;
};

Network.randomWeights = (rows, cols) => {
  let res = new Matrix(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      res.data[i][j] = randomRange(-10, 10);
    }
  }
  return res;
};

Network.randomMatrixn1 = size => {
  let res = new Matrix(size, 1);
  for (let i = 0; i < size; i++) res.data[i][0] = randomRange(-10, 10);
  return res;
};

function Network(
  inputLayer,
  outputLayerSize,
  hiddenLayersCount,
  hiddenLayersSize
) {
  let layers = [];
  layers.push(inputLayer);
  for (let i = 1; i < hiddenLayersCount; i++) {
    layers.push(
      new HiddenLayer(
        Network.randomMatrixn1(hiddenLayersSize),
        Network.randomWeights(
          hiddenLayersSize,
          layers[i - 1].neurons.data.length
        ),
        Network.randomMatrixn1(hiddenLayersSize)
      )
    );
  }
  layers.push(
    new OutputLayer(
      outputLayerSize,
      Network.randomWeights(
        outputLayerSize,
        layers[layers.length - 1].neurons.data.length
      ),
      Network.randomMatrixn1(outputLayerSize)
    )
  );
  return {
    layers
  };
}

console.log(
  new Network(new InputLayer(new Matrix(6, 1, 1, 0, 0, 1, 0, 0)), 2, 3, 3)
);
