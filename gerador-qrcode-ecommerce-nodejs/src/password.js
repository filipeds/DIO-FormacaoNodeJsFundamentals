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

module.exports = { loadPasswordConfig };
