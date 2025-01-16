const ClientError = require('../ClientError');

describe('ClientError', () => {
  it('should throw error when directly use it', () => {
    // Arrange, Action, and Assert
    expect(() => new ClientError('')).toThrowError('cannot instantiate abstract class');
  });
});
