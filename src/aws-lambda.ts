import {SQSEvent, SQSRecord} from 'aws-lambda';
import {InputModel} from './input.model';
import {Request} from './request/request';
import {RequestModel} from './request/request.model';

/**
 * Responsável por lidar com o evento da lambda
 */
export class AwsLambda {
  constructor(private request: Request) {}

  /**
   * Se houver callback de sucesso, realiza a requisição.
   * @param callback Contém as informação para performar o callback de sucesso.
   */
  private async sendSuccessCallback(
    callback: RequestModel | undefined
  ): Promise<void> {
    if (callback) {
      try {
        await this.request.simple(callback);
      } catch (error) {
        console.log(`[ ERROR ] | SEND SUCCESS CALLBACK | ${error.message}`);
      }
    }
  }

  /**
   * Caso ocorra algum erro durante a sincronização o callback de erro é chamado.
   * @param callback Contém as informaçÕes para performar o callback de erro.
   */
  private async sendErrorCallback(callback: RequestModel): Promise<void> {
    try {
      await this.request.simple(callback);
    } catch (error) {
      console.log(`[ ERROR ] | SEND ERROR CALLBACK | ${error.message}`);
    }
  }

  /**
   * Formata a mensagem para a model de entrada.
   * @param body contém a mensagem enviada para consumidor.
   */
  private parseBody(body: string): InputModel | undefined {
    try {
      const input = JSON.parse(body);

      return input;
    } catch (error) {
      console.log(`[ ERROR ] | PARSE CONTENT | ${error.message}`);
      return;
    }
  }

  /**
   * Intera sob os as mensagens salvas e executa a requisição.
   * @param event Evento da fila SQS recebido pela lambda.
   */
  async hanlder(event: SQSEvent): Promise<void> {
    const records: SQSRecord[] = event.Records;
    for (const record of records) {
      const input = this.parseBody(record.body);

      if (input) {
        try {
          await this.request.simple(input.content);
        } catch (error) {
          await this.sendErrorCallback(input.errorCallback);
        }

        await this.sendSuccessCallback(input.successCallback);
      }
    }
  }
}
