import {SQSEvent, SQSRecord} from 'aws-lambda';

import {AxiosResponse} from 'axios';
import {Methods} from '../src/request/request.model';
import {Mock} from 'moq.ts';

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
      data: {
        billetId: '811a99cd-0de0-4034-a9a8-f3568e22a530',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return body;
};

export const createMockAxiosResponse = (status?: number, data?: unknown) => {
  const mockEvent = new Mock<AxiosResponse>();
  const event = mockEvent;

  if (status) {
    event.setup(instance => instance.status).returns(status);
  }

  if (data) {
    event.setup(instance => instance.data).returns(data);
  }

  return event.object();
};
