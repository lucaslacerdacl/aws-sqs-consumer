import {Request} from '../../src/request/request';
import {Methods} from '../../src/request/request.model';
import axios from 'axios';
jest.mock('axios');

describe('Request', () => {
  const request = new Request();

  it('Envia uma requisição', async () => {
    const model = {
      method: Methods.POST,
      url: 'http://test.com/api/create',
      data: {
        name: 'Tony Stark',
        role: 'Avengers Owner',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await request.simple(model);

    expect(axios).toHaveBeenCalledWith({
      method: model.method,
      url: model.url,
      data: model.data,
      headers: model.headers,
    });
  });
});
