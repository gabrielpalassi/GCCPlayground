import type { Result } from "@/types";

export function getMockResult(code: string): Result {
  return {
    success: !(code === "error"),
    output:
      code === "error"
        ? "Compilação falhou devido a erros"
        : "Compilação bem-sucedida\nExecutável criado: a.out",
    assembly: `Disassembly of section .text:

0000000000001149 <main>:
    1149:	f3 0f 1e fa          	endbr64 
    114d:	55                   	push   %rbp
    114e:	48 89 e5             	mov    %rsp,%rbp
    1151:	48 8d 3d ac 0e 00 00 	lea    0xeac(%rip),%rdi
    1158:	e8 f3 fe ff ff       	callq  1050 <puts@plt>
    115d:	b8 00 00 00 00       	mov    $0x0,%eax
    1162:	5d                   	pop    %rbp
    1163:	c3                   	retq   
    1164:	66 2e 0f 1f 84 00 00 	nopw   %cs:0x0(%rax,%rax,1)`,
    binary: `7f454c46020101000000000000000000030003e000000000000000000000000000
4000000000000000980800000000000000000000400038000d0040001c001b000600
0000050000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000`,
  };
}
