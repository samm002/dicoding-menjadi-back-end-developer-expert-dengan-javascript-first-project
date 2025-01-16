class CreateReplyComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, thread_id, user_id, parent_comment_id } = payload;

    this.content = content;
    this.thread_id = thread_id;
    this.user_id = user_id;
    this.parent_comment_id = parent_comment_id;
  }

  _verifyPayload({ content, thread_id, user_id, parent_comment_id }) {
    if (!content || !thread_id || !user_id || !parent_comment_id) {
      throw new Error('CREATE_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof thread_id !== 'string' ||
      typeof user_id !== 'string' ||
      typeof parent_comment_id !== 'string'
    ) {
      throw new Error('CREATE_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateReplyComment;
