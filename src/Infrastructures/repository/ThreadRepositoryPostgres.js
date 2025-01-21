const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, utils) {
    super();
    this._pool = pool;
    this._utils = utils;
  }

  async createThread(payload) {
    const { title, body, user_id } = payload;
    const id = this._utils.generateId('thread');
    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4) RETURNING id, body, title, user_id',
      values: [id, title, body, user_id],
    };

    const result = await this._pool.query(query);

    return new CreatedThread({ ...result.rows[0] });
  }

  async viewThreadById(id) {
    const query = {
      text: `
        SELECT 
          threads.id, 
          threads.title, 
          threads.body, 
          threads.updated_at, 
          thread_users.username, 
          comments.id AS comment_id, 
          comment_users.username AS comment_username, 
          comments.updated_at AS comment_date, 
          comments.content, 
          comments.parent_comment_id,
          comments.is_deleted 
        FROM threads 
        LEFT JOIN users AS thread_users ON threads.user_id = thread_users.id 
        LEFT JOIN comments ON comments.thread_id = threads.id 
        LEFT JOIN users AS comment_users ON comments.user_id = comment_users.id 
        WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new DetailThread(result.rows);
  }
}

module.exports = ThreadRepositoryPostgres;
