import {Input} from '../src/input';
import {createBody} from './helper';

describe('Input', () => {
  it('Retorna o input com todas as propriedades corretas.', () => {
    const body = createBody();
    const bodyStringify = JSON.stringify(body);

    const input = Input.formatBodyToInput(bodyStringify);

    expect(input).toEqual(body);
  });

  it('Dispara uma exceção por falta das chaves padrões.', () => {
    const bodyStringify = JSON.stringify({test: 'Test default keys'});

    expect(() => Input.formatBodyToInput(bodyStringify)).toThrow(
      'Erro de parse: Propriedades não estão correspondetes.'
    );
  });
});
