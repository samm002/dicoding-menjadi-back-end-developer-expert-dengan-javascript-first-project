const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'Thread 1',
      body: 'Thread body',
      updated_at: '2025-01-08 10:30:26.511437',
      username: 'user-123',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'Thread 1',
      body: true,
      updated_at: '2025-01-08 10:30:26.511437',
      username: 'user-123',
      comments: []
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when comment is invalid', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'Thread 1',
      body: 'Isi dari Thread 1',
      updated_at: '2025-01-08 10:30:26.511437',
      username: 'user-123',
      comments: [
        {
          id: 'comment-1',
          content: 'This is a comment',
          username: 'comment_user',
          date: '2025-01-08 11:00:00.000000',
          replies: [
            {
              id: 'reply-1',
              content: 'This is a reply',
              username: 'reply_user',
              date: '2025-01-08 12:00:00.000000',
              replies: [
                {
                  id: 'nested-reply-1',
                  content: 'This is a nested reply',
                  username: 'nested_reply_user',
                  date: '2025-01-08 13:00:00.000000',
                },
              ],
            },
          ],
        },
      ],
    };

    payload.comments[0].replies[0].replies[0].content = 123;

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.INVALID_REPLY_CONTENT'
    );
  });

  it('should create a DetailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'Thread 1',
      body: 'Isi dari Thread 1',
      updated_at: '2025-01-08 10:30:26.511437',
      username: 'user-123',
      comments: [
        {
          id: 'comment-1',
          content: 'This is a comment',
          username: 'comment_user',
          date: '2025-01-08 11:00:00.000000',
          replies: [
            {
              id: 'reply-1',
              content: 'This is a reply',
              username: 'reply_user',
              date: '2025-01-08 12:00:00.000000',
              replies: [
                {
                  id: 'nested-reply-1',
                  content: 'This is a nested reply',
                  username: 'nested_reply_user',
                  date: '2025-01-08 13:00:00.000000',
                },
              ],
            },
          ],
        },
      ],
    };

    // Action
    const thread = new DetailThread(payload);

    // Assert

    // Thread
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.username).toEqual(payload.username);

    //Comments
    expect(thread.comments).toHaveLength(1);
    expect(thread.comments[0].id).toEqual(payload.comments[0].id);
    expect(thread.comments[0].content).toEqual(payload.comments[0].content);

    // Replies and nested replies
    expect(thread.comments[0].replies).toHaveLength(1);
    expect(thread.comments[0].replies[0].id).toEqual(
      payload.comments[0].replies[0].id
    );
    expect(thread.comments[0].replies[0].content).toEqual(
      payload.comments[0].replies[0].content
    );

    expect(thread.comments[0].replies[0].replies).toHaveLength(1);
    expect(thread.comments[0].replies[0].replies[0].id).toEqual(
      payload.comments[0].replies[0].replies[0].id
    );
    expect(thread.comments[0].replies[0].replies[0].content).toEqual(
      payload.comments[0].replies[0].replies[0].content
    );
  });
});
