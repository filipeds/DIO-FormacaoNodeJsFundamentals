const crypto = require('crypto');

const CHARACTER_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  specialCharacters: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function parseBoolean(value) {
  return value === 'true';
}

function loadPasswordConfig(env = process.env) {
  const config = {
    uppercase: parseBoolean(env.UPPERCASE_LETTERS),
    lowercase: parseBoolean(env.LOWERCASE_LETTERS),
    numbers: parseBoolean(env.NUMBERS),
    specialCharacters: parseBoolean(env.SPECIAL_CHARACTERS),
    length: Number(env.PASSWORD_LENGTH),
  };

  if (!config.uppercase && !config.lowercase && !config.numbers && !config.specialCharacters) {
    throw new Error(
      'Nenhum tipo de caractere habilitado no .env. Habilite ao menos um tipo (UPPERCASE_LETTERS, LOWERCASE_LETTERS, NUMBERS ou SPECIAL_CHARACTERS).'
    );
  }

  if (!Number.isInteger(config.length) || config.length <= 0) {
    throw new Error('PASSWORD_LENGTH deve ser um número inteiro maior que zero.');
  }

  return config;
}

function buildAlphabet(config) {
  return Object.keys(CHARACTER_SETS)
    .filter((key) => config[key])
    .map((key) => CHARACTER_SETS[key])
    .join('');
}

function generatePassword(config, randomInt = crypto.randomInt) {
  const alphabet = buildAlphabet(config);

  let password = '';
  for (let i = 0; i < config.length; i++) {
    const index = randomInt(alphabet.length);
    password += alphabet[index];
  }

  return password;
}

module.exports = { loadPasswordConfig, generatePassword };
