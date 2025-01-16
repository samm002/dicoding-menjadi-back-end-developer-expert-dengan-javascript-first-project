class CreatedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, user_id } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = user_id;
  }

  _verifyPayload({ id, title, body, user_id }) {
    if (!id || !title || !body || !user_id) {
      throw new Error('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof user_id !== 'string') {
      throw new Error('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreatedThread;
