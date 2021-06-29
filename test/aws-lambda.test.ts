import {
  createBody,
  createBodyWithSuccessCallback,
  createMockAxiosResponse,
  createMockEvent,
} from './helper';

import {AwsLambda} from '../src/aws-lambda.service';
import {Input} from '../src/input';
import {Request} from '../src/request/request.service';

describe('AWS Lambda', () => {
  const request = new Request();
  const awsLambda = new AwsLambda(request);

  it('Retorna a instância Aws Lambda', () => {
    expect(awsLambda).toBeTruthy();
  });

  it('Envia uma requisição sem callback de sucesso.', async () => {
    const body = createBody();
    const bodyStringify = JSON.stringify(body);
    const response = {
      status: 200,
      data: 'SUCCESS',
    };

    const event = createMockEvent(bodyStringify);

    const formatBodyToInputSpy = jest
      .spyOn(Input, 'formatBodyToInput')
      .mockReturnValue(body);
    const requestSimpleSpy = jest
      .spyOn(request, 'simple')
      .mockResolvedValue(
        createMockAxiosResponse(response.status, response.data)
      );
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await awsLambda.hanlder(event);

    expect(formatBodyToInputSpy).toHaveBeenCalledWith(bodyStringify);
    expect(requestSimpleSpy).toHaveBeenCalledWith(body.content);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `[ SUCCESS ] | STATUS | ${response.status}`,
      `[ SUCCESS ] | BODY | ${JSON.stringify(response.data)}`
    );
  });

  it('Envia uma requisição com callback de sucesso.', async () => {
    const body = createBodyWithSuccessCallback();
    const bodyStringify = JSON.stringify(body);
    const response = {
      status: 200,
      data: 'SUCCESS',
    };

    const event = createMockEvent(bodyStringify);

    const formatBodyToInputSpy = jest
      .spyOn(Input, 'formatBodyToInput')
      .mockReturnValue(body);
    const requestSimpleSpy = jest
      .spyOn(request, 'simple')
      .mockResolvedValue(
        createMockAxiosResponse(response.status, response.data)
      );
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await awsLambda.hanlder(event);

    expect(formatBodyToInputSpy).toHaveBeenCalledWith(bodyStringify);
    expect(requestSimpleSpy).toHaveBeenNthCalledWith(1, body.content);
    expect(requestSimpleSpy).toHaveBeenNthCalledWith(2, body.successCallback);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `[ SUCCESS ] | STATUS | ${response.status}`,
      `[ SUCCESS ] | BODY | ${JSON.stringify(response.data)}`
    );
  });

  it('Envia o callback de erro.', async () => {
    const consumerErrorMessage = 'Tony Stark is dead';
    const consumerErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: 'Invalid person.',
    };
    const body = createBody();
    const bodyStringify = JSON.stringify(body);

    const event = createMockEvent(bodyStringify);

    const formatBodyToInputSpy = jest
      .spyOn(Input, 'formatBodyToInput')
      .mockReturnValue(body);
    const requestSimpleFromContentSpy = jest
      .spyOn(request, 'simple')
      .mockImplementationOnce(() =>
        Promise.reject({
          message: consumerErrorMessage,
          response: consumerErrorResponse,
        })
      );
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await awsLambda.hanlder(event);

    expect(formatBodyToInputSpy).toHaveBeenCalledWith(bodyStringify);
    expect(requestSimpleFromContentSpy).toHaveBeenNthCalledWith(
      1,
      body.content
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `[ ERROR ] | SEND CALLBACK | ${consumerErrorMessage}`
    );
    expect(requestSimpleFromContentSpy).toHaveBeenNthCalledWith(
      2,
      body.errorCallback
    );
  });

  it('Mostra no console o erro de parse.', async () => {
    const body = createBody();
    const bodyStringify = JSON.stringify(body);

    const event = createMockEvent(bodyStringify);

    const parseErrorMessage = 'Could not parse.';
    const formatBodyToInputSpy = jest
      .spyOn(Input, 'formatBodyToInput')
      .mockImplementation(() => {
        throw Error(parseErrorMessage);
      });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await awsLambda.hanlder(event);

    expect(formatBodyToInputSpy).toHaveBeenCalledWith(bodyStringify);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `[ ERROR ] | PARSE CONTENT | ${parseErrorMessage}`
    );
  });

  it('Mostra no console a falha ao tentar enviar o callback de erro.', async () => {
    const consumerCallbackErrorMessage =
      'Tony Stark not implemented error callback';
    const consumerCallbackErrorResponse = {
      statusCode: 500,
      error: 'Not implemented',
      message: 'Callback not implemented.',
    };

    const consumerContentErrorMessage = 'Tony Stark is dead';
    const consumerContentErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: 'Invalid person.',
    };

    const body = createBody();
    const bodyStringify = JSON.stringify(body);
    const event = createMockEvent(bodyStringify);

    const formatBodyToInputSpy = jest
      .spyOn(Input, 'formatBodyToInput')
      .mockReturnValue(body);

    const requestSimpleFromContentSpy = jest
      .spyOn(request, 'simple')
      .mockImplementationOnce(() =>
        Promise.reject({
          message: consumerContentErrorMessage,
          response: consumerContentErrorResponse,
        })
      )
      .mockImplementationOnce(() =>
        Promise.reject({
          message: consumerCallbackErrorMessage,
          response: consumerCallbackErrorResponse,
        })
      );

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await awsLambda.hanlder(event);

    expect(formatBodyToInputSpy).toHaveBeenCalledWith(bodyStringify);
    expect(requestSimpleFromContentSpy).toHaveBeenNthCalledWith(
      1,
      body.content
    );
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      1,
      `[ ERROR ] | SEND CALLBACK | ${consumerContentErrorMessage}`
    );
    expect(requestSimpleFromContentSpy).toHaveBeenNthCalledWith(
      2,
      body.errorCallback
    );
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      2,
      `[ ERROR ] | SEND ERROR CALLBACK | ${consumerCallbackErrorMessage}`
    );
  });

  it('Mostra no console a falha ao tentar enviar o callback de sucesso.', async () => {
    const body = createBodyWithSuccessCallback();
    const bodyStringify = JSON.stringify(body);
    const event = createMockEvent(bodyStringify);
    const response = {
      status: 200,
      data: 'SUCCESS',
    };

    const formatBodyToInputSpy = jest
      .spyOn(Input, 'formatBodyToInput')
      .mockReturnValue(body);
    const consumerCallbackSuccessErrorMessage =
      'Tony Stark not implemented success callback';
    const requestSimpleFromContentSpy = jest
      .spyOn(request, 'simple')
      .mockResolvedValueOnce(
        createMockAxiosResponse(response.status, response.data)
      )
      .mockRejectedValueOnce(new Error(consumerCallbackSuccessErrorMessage));
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await awsLambda.hanlder(event);

    expect(formatBodyToInputSpy).toHaveBeenCalledWith(bodyStringify);
    expect(requestSimpleFromContentSpy).toHaveBeenNthCalledWith(
      1,
      body.content
    );
    expect(requestSimpleFromContentSpy).toHaveBeenNthCalledWith(
      2,
      body.successCallback
    );
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      1,
      `[ SUCCESS ] | STATUS | ${response.status}`,
      `[ SUCCESS ] | BODY | ${JSON.stringify(response.data)}`
    );
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      2,
      `[ ERROR ] | SEND SUCCESS CALLBACK | ${consumerCallbackSuccessErrorMessage}`
    );
  });
});
