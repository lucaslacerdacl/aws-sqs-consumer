import {SQSRecord, SQSEvent} from 'aws-lambda';
import {AxiosResponse} from 'axios';
import {Mock} from 'moq.ts';
import {Methods} from '../src/request/request.model';

export const createMockEvent = (body: string) => {
  const mockRecord = new Mock<SQSRecord>();
  const record = mockRecord
    .setup(instance => instance.body)
    .returns(body)
    .object();

  const mockEvent = new Mock<SQSEvent>();
  const event = mockEvent
    .setup(instance => instance.Records)
    .returns([record])
    .object();

  return event;
};

export const createBody = (message?: string | undefined) => {
  const body = {
    content: {
      method: Methods.POST,
      url: 'http://test.com/api/create',
      data: {
        name: 'Tony Stark',
        role: 'Avengers Owner',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
    errorCallback: {
      method: Methods.POST,
      url: 'http://test.com/api/callback/error',
      data: {
        message,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return body;
};

export const createBodyWithSuccessCallback = (message?: string | undefined) => {
  const body = {
    content: {
      method: Methods.POST,
      url: 'http://test.com/api/create',
      data: {
        name: 'Tony Stark',
        role: 'Avengers Owner',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
    errorCallback: {
      method: Methods.POST,
      url: 'http://test.com/api/callback/error',
      data: {
        message,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
    successCallback: {
      method: Methods.POST,
      url: 'http://test.com/api/callback/success',
      data: undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return body;
};

export const createMockAxiosResponse = () => {
  const mockEvent = new Mock<AxiosResponse>();
  const event = mockEvent.object();

  return event;
};
