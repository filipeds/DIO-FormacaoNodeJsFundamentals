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
