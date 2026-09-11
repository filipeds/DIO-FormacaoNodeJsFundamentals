const fs = require('fs');
const path = require('path');
const { generateQrCodeFile } = require('../src/qrCode');

jest.mock('fs');

describe('generateQrCodeFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('creates the output directory if it does not exist and calls toFile with the correct path and url', async () => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdirSync.mockImplementation(() => {});
    const toFile = jest.fn().mockResolvedValue();

    const filePath = await generateQrCodeFile('https://example.com/produto', 'produto-teste', { toFile });

    expect(fs.mkdirSync).toHaveBeenCalledWith('output', { recursive: true });
    expect(toFile).toHaveBeenCalledWith(path.join('output', 'produto-teste.png'), 'https://example.com/produto');
    expect(filePath).toBe(path.join('output', 'produto-teste.png'));
  });

  test('does not recreate the output directory if it already exists', async () => {
    fs.existsSync.mockReturnValue(true);
    const toFile = jest.fn().mockResolvedValue();

    await generateQrCodeFile('https://example.com/produto', 'produto-teste', { toFile });

    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  test('propagates a descriptive error when toFile fails', async () => {
    fs.existsSync.mockReturnValue(true);
    const toFile = jest.fn().mockRejectedValue(new Error('disk full'));

    await expect(
      generateQrCodeFile('https://example.com/produto', 'produto-teste', { toFile })
    ).rejects.toThrow('disk full');
  });
});

const { generateQrCodeTerminal } = require('../src/qrCode');

describe('generateQrCodeTerminal', () => {
  test('calls generate with the url and resolves with the ascii output', async () => {
    const generate = jest.fn((url, options, callback) => {
      callback('ASCII-QR-CODE');
    });

    const result = await generateQrCodeTerminal('https://example.com/produto', { generate });

    expect(generate).toHaveBeenCalledWith('https://example.com/produto', { small: true }, expect.any(Function));
    expect(result).toBe('ASCII-QR-CODE');
  });

  test('rejects with a descriptive error when generate produces no output', async () => {
    const generate = jest.fn((url, options, callback) => {
      callback(undefined);
    });

    await expect(generateQrCodeTerminal('https://example.com/produto', { generate })).rejects.toThrow(
      'Não foi possível gerar o QR Code no terminal.'
    );
  });
});
