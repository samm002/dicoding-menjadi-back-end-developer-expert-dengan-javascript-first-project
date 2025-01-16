const Utils = require('../utils');

describe('Utils', () => {
  describe('Utils.generateSecondFromHour', () => {
    it('should return converting hour to second', () => {
      // Arrange
      const fakeIdGenerator = jest.fn(() => '123'); // mock
      const utils = new Utils(fakeIdGenerator);
  
      const hourPayload = 1;
      const hourInSecond = 3600;
  
      // Action & Assert
      expect(utils.generateSecondFromHour(hourPayload)).toEqual(hourInSecond);
    });
  });
  describe('Utils.generateId', () => {
    it('should return id based on entity given in argument', () => {
      // Arrange
      const fakeIdGenerator = jest.fn(() => '123'); // mock
      const utils = new Utils(fakeIdGenerator);

      const entity = 'test'
      const expectedResult = 'test-123'

      // Action
      const result = utils.generateId(entity);
  
      // Assert
      expect(fakeIdGenerator).toHaveBeenCalled();
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
