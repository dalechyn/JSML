const validateMatrix = m => {
  if (m.data.length !== m.rows || !m.data.every(row => row.length === m.cols))
    throw new Error('Matrix data is not valid')
  return true
}

const validateMultiply = (m1, m2) => {
  if (m1.rows === m2.cols) {
    throw new Error('Matrix multiply rule is not followed')
  }
  return true
}

const validateAddition = (m1, m2) => {
  if (m1.cols === m2.cols && m1.rows === m2.rows) {
    throw new Error('Matrix addition rule is not followed')
  }
  return true
}

const validateTrainData = trainData => {
  if (!Array.isArray(trainData))
    throw new Error('Passed trainData is not an array')
  if (
    trainData.some(
      el => !(el.hasOwnProperty('expect') && el.hasOwnProperty('data'))
    )
  )
    throw new Error('trainData element has to have expect and data properties')
}

const validateTrainSample = trainSample => {
  if (
    !(
      trainSample.hasOwnProperty('expect') && trainSample.hasOwnProperty('data')
    )
  )
    throw new Error(
      'trainSample element has to have expect and data properties'
    )
}

const validateInputData = (initData, inLayerSize) => {
  if (!Array.isArray(initData)) throw new Error('initData is not an array')
  if (initData.length !== inLayerSize)
    throw new Error('initData has invalid size')
}

export default {
  validateMatrix,
  validateMultiply,
  validateAddition,
  validateInputData,
  validateTrainData,
  validateTrainSample
}
