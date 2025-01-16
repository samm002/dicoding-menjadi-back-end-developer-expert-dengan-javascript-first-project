const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, utils) {
    super();
    this._pool = pool;
    this._utils = utils;
  }

  async createComment(payload) {
    const { thread_id, user_id, content } = payload;
    const id = this._utils.generateId('comment');

    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4) RETURNING id, content, user_id',
      values: [id, content, thread_id, user_id],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async createReply(payload) {
    const { thread_id, user_id, parent_comment_id, content } = payload;
    const id = this._utils.generateId('reply');

    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5) RETURNING id, content, user_id',
      values: [id, content, thread_id, user_id, parent_comment_id],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async validateThreadExist(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async validateCommentExist(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async validateCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT user_id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    
    if (result.rows[0].user_id !== userId) {
      throw new AuthorizationError('Anda bukan pemilik comment');
    }
  }
}

module.exports = CommentRepositoryPostgres;
