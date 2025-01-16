class CreateComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, thread_id, user_id } = payload;

    this.content = content;
    this.thread_id = thread_id;
    this.user_id = user_id;
  }

  _verifyPayload({ content, thread_id, user_id }) {
    if (!content || !thread_id || !user_id) {
      throw new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof thread_id !== 'string' || typeof user_id !== 'string') {
      throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateComment;
