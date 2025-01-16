const CreateCommentUseCase = require('../../../../Applications/use_case/comments/CreateCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');
const CreateReplyCommentUseCase = require('../../../../Applications/use_case/comments/replies/CreateReplyCommentUseCase');
const DeleteReplyCommentUseCase = require('../../../../Applications/use_case/comments/replies/DeleteReplyCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.postReplyCommentHandler = this.postReplyCommentHandler.bind(this);
    this.deleteReplyCommentHandler = this.deleteReplyCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    request.payload.user_id = request.auth.credentials.user.id;
    request.payload.thread_id = request.params.threadId;

    const createCommentUseCase = this._container.getInstance(
      CreateCommentUseCase.name
    );
    const addedComment = await createCommentUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);

    return response;
  }

  async deleteCommentHandler(request, h) {
    const payload = {
      user_id: request.auth.credentials.user.id,
      thread_id: request.params.threadId,
      comment_id: request.params.commentId,
    }

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    
    await deleteCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });

    return response;
  }

  async postReplyCommentHandler(request, h) {
    request.payload.user_id = request.auth.credentials.user.id;
    request.payload.thread_id = request.params.threadId;
    request.payload.parent_comment_id = request.params.commentId;

    const createReplyCommentUseCase = this._container.getInstance(
      CreateReplyCommentUseCase.name
    );
    const addedReply = await createReplyCommentUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);

    return response;
  }

  async deleteReplyCommentHandler(request, h) {
    const payload = {
      user_id: request.auth.credentials.user.id,
      thread_id: request.params.threadId,
      parent_comment_id: request.params.commentId,
      reply_id: request.params.replyId,
    }

    const deleteReplyCommentUseCase = this._container.getInstance(
      DeleteReplyCommentUseCase.name
    );
    
    await deleteReplyCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });

    return response;
  }
}

module.exports = CommentsHandler;
