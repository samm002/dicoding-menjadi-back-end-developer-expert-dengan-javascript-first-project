const CreateComment = require('../../../Domains/comments/entities/CreateComment');

class CreateCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const createComment = new CreateComment(useCasePayload);
    
    await this._commentRepository.validateThreadExist(createComment.thread_id);

    return this._commentRepository.createComment(createComment);
  }
}

module.exports = CreateCommentUseCase;
