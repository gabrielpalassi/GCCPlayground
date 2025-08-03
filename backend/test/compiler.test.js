import { compileCode } from '../src/services/compiler.js';

describe('Compiler Service', () => {
  test('should compile valid C code successfully', async () => {
    const code = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;

    const flags = {
      wall: true,
      werror: false,
      debug: false,
      static: false,
      optimization: 'O0'
    };

    const result = await compileCode(code, flags);

    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('output');
    expect(result).toHaveProperty('assembly');
    expect(result).toHaveProperty('binary');
    
    if (result.success) {
      expect(result.output).toContain('Compilation successful');
      expect(result.assembly).toContain('Disassembly');
      expect(result.binary).toBeTruthy();
    }
  });

  test('should handle compilation errors', async () => {
    const code = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n"
    return 0;
}`; // Missing closing parenthesis

    const flags = {
      wall: true,
      werror: false,
      debug: false,
      static: false,
      optimization: 'O0'
    };

    const result = await compileCode(code, flags);

    expect(result.success).toBe(false);
    expect(result.output).toContain('error');
    expect(result.assembly).toBe('');
    expect(result.binary).toBe('');
  });
}); 