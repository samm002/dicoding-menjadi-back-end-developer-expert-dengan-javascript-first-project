class Utils {
  constructor(idGenerator) {
    this._idGenerator = idGenerator
  }

  generateSecondFromHour(hour) {
    return hour * 60 * 60;
  }
  
  generateId(entity) {
    return `${entity}-${this._idGenerator()}`
  }
}

module.exports = Utils;
