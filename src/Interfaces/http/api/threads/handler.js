const CreateThreadUseCase = require('../../../../Applications/use_case/threads/CreateThreadUseCase');
const ViewThreadByIdUseCase = require('../../../../Applications/use_case/threads/ViewThreadByIdUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    request.payload.user_id = request.auth.credentials.user.id;

    const createThreadUseCase = this._container.getInstance(
      CreateThreadUseCase.name
    );
    const addedThread = await createThreadUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });

    response.code(201);

    return response;
  }

  async getThreadHandler(request, h) {
    const id = request.params.threadId;

    const viewThreadByIdUseCase = this._container.getInstance(
      ViewThreadByIdUseCase.name
    );
    const thread = await viewThreadByIdUseCase.execute(id);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });

    return response;
  }
}

module.exports = ThreadsHandler;
