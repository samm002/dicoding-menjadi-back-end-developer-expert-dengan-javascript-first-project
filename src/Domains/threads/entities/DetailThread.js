class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, updated_at, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = updated_at;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({ id, title, body, updated_at, username, comments }) {
    if (
      !id ||
      !title ||
      !body ||
      !updated_at ||
      !username ||
      !Array.isArray(comments)
    ) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      isNaN(Date.parse(updated_at)) ||
      typeof username !== 'string'
    ) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (comments && comments.length > 0) {
      comments.forEach((comment) => {
        this._verifyComment(comment);
      });
    }
  }

  // Validate comments
  _verifyComment(comment) {
    if (!comment.id || typeof comment.id !== 'string') {
      throw new Error(`DETAIL_THREAD.INVALID_COMMENT_ID`);
    }
    if (!comment.content || typeof comment.content !== 'string') {
      throw new Error(`DETAIL_THREAD.INVALID_COMMENT_CONTENT`);
    }
    if (!comment.username || typeof comment.username !== 'string') {
      throw new Error(`DETAIL_THREAD.INVALID_COMMENT_USERNAME`);
    }
    if (isNaN(Date.parse(comment.date))) {
      throw new Error(`DETAIL_THREAD.INVALID_COMMENT_DATE`);
    }

    if (comment.replies && Array.isArray(comment.replies)) {
      comment.replies.forEach((reply) => {
        this._verifyReply(reply);
      });
    }
  }

  // validate replies
  _verifyReply(reply) {
    if (!reply.id || typeof reply.id !== 'string') {
      throw new Error(`DETAIL_THREAD.INVALID_REPLY_ID`);
    }
    if (!reply.content || typeof reply.content !== 'string') {
      throw new Error(`DETAIL_THREAD.INVALID_REPLY_CONTENT`);
    }
    if (!reply.username || typeof reply.username !== 'string') {
      throw new Error(`DETAIL_THREAD.INVALID_REPLY_USERNAME`);
    }
    if (isNaN(Date.parse(reply.date))) {
      throw new Error(`DETAIL_THREAD.INVALID_REPLY_DATE`);
    }

    if (reply.replies && Array.isArray(reply.replies)) {
      reply.replies.forEach((nestedReply) => {
        this._verifyReply(nestedReply);
      });
    }
  }
}

module.exports = DetailThread;
