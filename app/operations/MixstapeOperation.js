class MixstapeOperation {
  static createFrom(operationData) {
    return new MixstapeOperation(operationData.type, operationData.input, operationData.config);
  }
  
  constructor(operationType, input, config) {
    this._type = operationType;
    this._input = input;
    this._config = config;
  }
}

module.exports = MixstapeOperation;