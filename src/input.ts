import {InputModel} from './input.model';

/**
 * Responsável por lidar com a entrada de dados.
 */
export class Input {
  /**
   * Formata o body que está como string para um objeto.
   * @param body Menssagem enviada para a fila.
   * @returns Menssagem formatada para ser executada.
   */
  static formatBodyToInput(body: string): InputModel {
    const input = JSON.parse(body);

    const defaultKeys = ['content', 'errorCallback'];
    const inputKeys = Object.keys(input);

    const valid = defaultKeys.every(value => {
      return inputKeys.includes(value);
    });

    if (!valid) {
      throw Error('Erro de parse: Propriedades não estão correspondetes.');
    }

    return input;
  }
}
