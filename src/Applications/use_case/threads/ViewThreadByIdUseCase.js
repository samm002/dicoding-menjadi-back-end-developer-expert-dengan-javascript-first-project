class ViewThreadByIdUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(id) {
    const threadDetail = await this._threadRepository.viewThreadById(id);

    return threadDetail;
  }
}

module.exports = ViewThreadByIdUseCase;
