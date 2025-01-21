const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should create DetailThread object correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: 'comment-123',
        comment_username: 'user-abc',
        comment_date: '2025-01-20T07:01:00.000Z',
        content: 'A comment',
        is_deleted: false,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: 'reply-123',
        comment_username: 'user-xyz',
        comment_date: '2025-01-20T07:02:00.000Z',
        content: 'A reply',
        is_deleted: false,
        parent_comment_id: 'comment-123',
      }
    ];

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.id).toEqual(payload[0].id);
    expect(detailThread.title).toEqual(payload[0].title);
    expect(detailThread.body).toEqual(payload[0].body);
    expect(detailThread.date).toEqual(payload[0].updated_at);
    expect(detailThread.username).toEqual(payload[0].username);
    expect(detailThread.comments).toHaveLength(1);
    expect(detailThread.comments[0].id).toEqual('comment-123');
    expect(detailThread.comments[0].username).toEqual('user-abc');
    expect(detailThread.comments[0].content).toEqual('A comment');
    expect(detailThread.comments[0].replies).toHaveLength(1);
    expect(detailThread.comments[0].replies[0].id).toEqual('reply-123');
    expect(detailThread.comments[0].replies[0].content).toEqual('A reply');
  });

  it('should show deleted comment text when comment is deleted', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'comment-123',
        comment_username: 'user-abc',
        comment_date: '2025-01-20T07:01:00.000Z',
        content: 'A comment',
        is_deleted: true,
        parent_comment_id: null,
      }
    ];

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.comments[0].content).toEqual('**komentar telah dihapus**');
  });

  it('should show deleted reply text when reply is deleted', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'comment-123',
        comment_username: 'user-abc',
        comment_date: '2025-01-20T07:01:00.000Z',
        content: 'A comment',
        is_deleted: false,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'reply-123',
        comment_username: 'user-xyz',
        comment_date: '2025-01-20T07:02:00.000Z',
        content: 'A reply',
        is_deleted: true,
        parent_comment_id: 'comment-123',
      }
    ];

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        body: 'Thread body', // missing title
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
      }
    ];

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = [
      {
        id: 123, // should be string
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
      }
    ];

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when comment has invalid properties (comment id)', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 123, // invalid comment id
        comment_username: 'user-abc',
        comment_date: 'invalid-date', 
        content: 'A comment',
        is_deleted: false,
        parent_comment_id: null,
      }
    ];

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.INVALID_COMMENT_ID');
  });

  it('should throw error when comment has invalid properties (comment content)', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'comment-123',
        comment_username: 'user-abc',
        comment_date: 'invalid-date', 
        content: 123, // invalid comment content
        is_deleted: false,
        parent_comment_id: null,
      }
    ];

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.INVALID_COMMENT_CONTENT');
  });

  it('should throw error when comment has invalid properties (comment username)', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'comment-123',
        comment_username: 123, // invalid comment username
        comment_date: 'invalid-date', 
        content: 'A comment',
        is_deleted: false,
        parent_comment_id: null,
      }
    ];

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.INVALID_COMMENT_USERNAME');
  });

  it('should throw error when comment has invalid properties (comment date)', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'comment-123',
        comment_username: 'user-abc',
        comment_date: 'invalid-date', // invalid comment date
        content: 'A comment',
        is_deleted: false,
        parent_comment_id: null,
      }
    ];

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.INVALID_COMMENT_DATE');
  });

  it('should throw error when reply has invalid properties (reply id)', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'comment-123',
        comment_username: 'user-abc',
        comment_date: '2025-01-20T07:01:00.000Z',
        content: 'A comment',
        is_deleted: false,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 123, // invalid id
        comment_username: 'user-xyz',
        comment_date: '2025-01-20T07:02:00.000Z',
        content: 'First reply',
        is_deleted: false,
        parent_comment_id: 'comment-123',
      }
    ];

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.INVALID_REPLY_ID');
  });

  it('should throw error when reply has invalid properties (reply content)', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'comment-123',
        comment_username: 'user-abc',
        comment_date: '2025-01-20T07:01:00.000Z',
        content: 'A comment',
        is_deleted: false,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'reply-123', 
        comment_username: 'user-xyz',
        comment_date: '2025-01-20T07:02:00.000Z',
        content: 123, // invalid content
        is_deleted: false,
        parent_comment_id: 'comment-123',
      }
    ];

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.INVALID_REPLY_CONTENT');
  });

  it('should throw error when reply has invalid properties (reply username)', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'comment-123',
        comment_username: 'user-abc',
        comment_date: '2025-01-20T07:01:00.000Z',
        content: 'A comment',
        is_deleted: false,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'reply-123', 
        comment_username: 123, // invalid username
        comment_date: '2025-01-20T07:02:00.000Z',
        content: 'First reply',
        is_deleted: false,
        parent_comment_id: 'comment-123',
      }
    ];

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.INVALID_REPLY_USERNAME');
  });

  it('should throw error when reply has invalid properties (reply date)', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'comment-123',
        comment_username: 'user-abc',
        comment_date: '2025-01-20T07:01:00.000Z',
        content: 'A comment',
        is_deleted: false,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'reply-123', 
        comment_username: 'user-123',
        comment_date: 'invalid date', // invalid date
        content: 'First reply',
        is_deleted: false,
        parent_comment_id: 'comment-123',
      }
    ];

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.INVALID_REPLY_DATE');
  });

  it('should handle nested replies correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'comment-123',
        comment_username: 'user-abc',
        comment_date: '2025-01-20T07:01:00.000Z',
        content: 'A comment',
        is_deleted: false,
        parent_comment_id: null,
      },
      {
        id: 'thread-123',
        comment_id: 'reply-123',
        comment_username: 'user-xyz',
        comment_date: '2025-01-20T07:02:00.000Z',
        content: 'First reply',
        is_deleted: false,
        parent_comment_id: 'comment-123',
      },
      {
        id: 'thread-123',
        comment_id: 'reply-456',
        comment_username: 'user-xyz',
        comment_date: '2025-01-20T07:03:00.000Z',
        content: 'Nested reply',
        is_deleted: false,
        parent_comment_id: 'reply-123',
      }
    ];

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.comments[0].replies).toHaveLength(1);
    expect(detailThread.comments[0].replies[0].replies).toHaveLength(1);
    expect(detailThread.comments[0].replies[0].replies[0].content).toEqual('Nested reply');
  });

  it('should handle empty comments correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body',
        updated_at: '2025-01-20T07:00:00.000Z',
        username: 'user-123',
        comment_id: null,
        parent_comment_id: null,
      }
    ];

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.comments).toHaveLength(0);
  });
});