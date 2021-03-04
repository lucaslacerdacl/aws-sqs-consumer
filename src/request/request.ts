import axios, {AxiosResponse} from 'axios';
import {RequestModel} from './request.model';

/**
 * Responsável por gerenciar o envio de requests.
 */
export class Request {
  /**
   * Executa uma request através do paramêtros fornecidos.
   * @param request Contém os parêmtros para envio da request.
   */
  async simple(request: RequestModel): Promise<AxiosResponse> {
    const response = await axios({
      method: request.method,
      url: request.url,
      data: request.data,
      headers: request.headers,
    });

    return response;
  }
}
