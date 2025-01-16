const ClientError = require('../ClientError');
const NotFoundError = require('../NotFoundError');

describe('NotFoundError', () => {
  it('should create error correctly', () => {
    // Arrange
    const notFoundError = new NotFoundError('not found!');

    // Action & Assert
    expect(notFoundError).toBeInstanceOf(NotFoundError);
    expect(notFoundError).toBeInstanceOf(ClientError);
    expect(notFoundError).toBeInstanceOf(Error);

    expect(notFoundError.message).toEqual('not found!');
    expect(notFoundError.statusCode).toEqual(404);
    expect(notFoundError.name).toEqual('NotFoundError');
  });
});
