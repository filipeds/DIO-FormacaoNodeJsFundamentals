const fs = require('fs');
const os = require('os');
const path = require('path');
const { generateQrCodeFile } = require('../src/qrCode');

// This file intentionally does NOT `jest.mock('fs')`, unlike test/qrCode.test.js.
// It exercises generateQrCodeFile's real default dependency wiring
// (`deps.toFile || qrcode.toFile`) against the actual `qrcode` npm package,
// writing a real PNG to disk. This guards against the same class of bug that
// shipped in generateQrCodeTerminal, where the default wiring detached the
// library function from its receiver and broke every real (non-test) call.

describe('generateQrCodeFile (real qrcode dependency)', () => {
  let originalCwd;
  let tempDir;

  beforeAll(() => {
    originalCwd = process.cwd();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qrcode-real-test-'));
    process.chdir(tempDir);
  });

  afterAll(() => {
    process.chdir(originalCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('writes a real, non-empty PNG file using the real qrcode.toFile default', async () => {
    const filePath = await generateQrCodeFile('https://example.com/produto', 'produto-real-teste');

    const absolutePath = path.resolve(tempDir, filePath);
    expect(fs.existsSync(absolutePath)).toBe(true);

    const stats = fs.statSync(absolutePath);
    expect(stats.isFile()).toBe(true);
    expect(stats.size).toBeGreaterThan(0);

    const signature = fs.readFileSync(absolutePath).subarray(0, 8);
    const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(signature.equals(PNG_SIGNATURE)).toBe(true);
  });
});
