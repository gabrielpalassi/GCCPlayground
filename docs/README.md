# 🧑‍💻 GCC Playground

Um playground moderno de compilador C baseado em tecnologias web, construído com Node, React, TypeScript e o Monaco Editor, feito como projeto final da disciplina PCS3732 - Laboratório de Processadores da Escola Politécnica da Universidade de São Paulo. Escreva, compile e analise código C com destaque de sintaxe em tempo real e ferramentas de desenvolvimento profissionais.

<img src="./frontend.png" height=480 width=958>

## Funcionalidades

### **Editor de Código Moderno**

- **Integração com Monaco Editor**: O mesmo editor poderoso usado no VS Code
- **Destaque de Sintaxe C**: Destaque completo de sintaxe com tema personalizado
- **IntelliSense**: Auto-completar e sugestões de código
- **Recursos Inteligentes**: Fechamento automático de parênteses, indentação inteligente, correspondência de parênteses

### **Configuração do Compilador**

- **Flags do GCC**: Alterne flags comuns do compilador (-Wall, -Werror, -g, -static)
- **Níveis de Otimização**: Escolha entre O0, O1, O2, O3, Os, Ofast
- **Comando em Tempo Real**: Veja o comando GCC gerado no cabeçalho

### **Saída Multi-Painel**

- **Saída de Compilação**: Mensagens de sucesso/erro
- **Dump Assembly**: Dump assembly do arquivo-objeto
- **Saída Binária**: Dump do binário compilado
- **Tratamento de Erros**: Feedback claro para falhas de compilação

## Front-end

### Estrutura

```
src/
├── components/         # Componentes React
│   ├── ui/             # Componentes shadcn/ui
│   └── code-editor.tsx # Wrapper do Monaco Editor
├── lib/                # Utilitários e helpers
│   ├── constants.ts    # Template padrão de código C
│   ├── mockData.ts     # Resultados de compilação simulados
│   ├── monacoTheme.ts  # Tema personalizado do Monaco Editor
│   └── utils.ts        # Funções utilitárias
├── types/              # Definições de tipos TypeScript
│   └── index.ts        # Interfaces compartilhadas
├── App.tsx             # Componente principal da aplicação
├── main.tsx            # Ponto de entrada da aplicação
└── index.css           # Estilos globais e variáveis CSS
```

### Tecnologias Utilizadas

#### Framework Principal

- **React 18** - React moderno com hooks
- **TypeScript** - JavaScript com segurança de tipos
- **Vite** - Ferramenta de build rápida e servidor de dev

#### UI e Estilização

- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes React de alta qualidade
- **Lucide React** - Ícones SVG

#### Editor de Código

- **Monaco Editor** - Editor do VS Code no navegador
- **Tema Personalizado** - Integrado com o nosso design-system

### Scripts Disponíveis

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Construir para produção
- `npm run preview` - Visualizar build de produção

_Lembre-se de instalar as dependências com `npm install` antes de iniciar o projeto pela primeira vez!_

## Back-end

### Estrutura

### Tecnologias Utilizadas

### Scripts Disponíveis

## Contribuindo

1. Faça um fork do repositório
2. Crie sua branch de feature (`git checkout -b feature/funcionalidade-incrivel`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona funcionalidade incrível'`)
4. Faça push para a branch (`git push origin feature/funcionalidade-incrivel`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença GPL-3, veja o arquivo [LICENSE](LICENSE) para detalhes.
