const { loadPasswordConfig } = require('../src/password');

describe('loadPasswordConfig', () => {
  test('parses booleans and length from env', () => {
    const config = loadPasswordConfig({
      UPPERCASE_LETTERS: 'true',
      LOWERCASE_LETTERS: 'true',
      NUMBERS: 'false',
      SPECIAL_CHARACTERS: 'false',
      PASSWORD_LENGTH: '10',
    });

    expect(config).toEqual({ uppercase: true, lowercase: true, numbers: false, specialCharacters: false, length: 10 });
  });

  test('treats any non-"true" value as false', () => {
    const config = loadPasswordConfig({
      UPPERCASE_LETTERS: 'yes',
      LOWERCASE_LETTERS: 'true',
      NUMBERS: '1',
      SPECIAL_CHARACTERS: '',
      PASSWORD_LENGTH: '8',
    });

    expect(config.uppercase).toBe(false);
    expect(config.numbers).toBe(false);
    expect(config.specialCharacters).toBe(false);
  });

  test('throws when no character type is enabled', () => {
    expect(() =>
      loadPasswordConfig({
        UPPERCASE_LETTERS: 'false',
        LOWERCASE_LETTERS: 'false',
        NUMBERS: 'false',
        SPECIAL_CHARACTERS: 'false',
        PASSWORD_LENGTH: '10',
      })
    ).toThrow('Nenhum tipo de caractere habilitado');
  });

  test.each(['0', '-5', '3.5', 'abc', undefined])('throws for invalid PASSWORD_LENGTH %p', (length) => {
    expect(() =>
      loadPasswordConfig({
        UPPERCASE_LETTERS: 'true',
        LOWERCASE_LETTERS: 'false',
        NUMBERS: 'false',
        SPECIAL_CHARACTERS: 'false',
        PASSWORD_LENGTH: length,
      })
    ).toThrow('PASSWORD_LENGTH');
  });
});

const { generatePassword } = require('../src/password');

describe('generatePassword', () => {
  test('produces a password of the exact configured length', () => {
    const config = { uppercase: true, lowercase: false, numbers: false, specialCharacters: false, length: 8 };
    const randomInt = jest.fn().mockReturnValue(0);

    const password = generatePassword(config, randomInt);

    expect(password).toHaveLength(8);
    expect(password).toBe('AAAAAAAA');
  });

  test('only uses characters from the enabled sets', () => {
    const config = { uppercase: false, lowercase: false, numbers: true, specialCharacters: false, length: 6 };
    let call = 0;
    const sequence = [0, 3, 9, 5, 1, 7];
    const randomInt = jest.fn(() => sequence[call++]);

    const password = generatePassword(config, randomInt);

    expect(password).toBe('039517');
    expect(password).toMatch(/^[0-9]+$/);
  });

  test('combines multiple enabled character sets into one alphabet', () => {
    const config = { uppercase: true, lowercase: false, numbers: true, specialCharacters: false, length: 2 };
    const randomInt = jest.fn().mockReturnValueOnce(0).mockReturnValueOnce(26);

    const password = generatePassword(config, randomInt);

    expect(password).toBe('A0');
  });
});
