const CreateComment = require('../CreateComment');

describe('a CreateComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Comment 1 content',
      thread_id: 'thread-123',
    };

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: true,
      thread_id: 'thread-123',
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createThread object correctly', () => {
    // Arrange
    const payload = {
      content: 'Comment 1 content',
      thread_id: 'thread-123',
      user_id: 'user-123',
    };

    // Action
    const { content, thread_id, user_id } = new CreateComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(thread_id).toEqual(payload.thread_id);
    expect(user_id).toEqual(payload.user_id);
  });
});
