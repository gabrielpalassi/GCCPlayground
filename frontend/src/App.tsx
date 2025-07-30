import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Label } from "./components/ui/label";
import { Switch } from "./components/ui/switch";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Play, Settings, Terminal, FileCode, Binary } from "lucide-react";
import Editor from "@monaco-editor/react";
import CodeEditor from "./components/code-editor";
import type { CompilerFlags, Result } from "./types";
import { getMockResult } from "./lib/mockData";
import { DEFAULT_C_CODE } from "./lib/constants";
import { defineCustomTheme } from "./lib/monacoTheme";
import axios from "axios";
import "./App.css";

export default function App() {
  const [code, setCode] = useState(DEFAULT_C_CODE);
  const [result, setResult] = useState<Result | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [flags, setFlags] = useState<CompilerFlags>({
    wall: true,
    werror: false,
    debug: false,
    static: false,
    optimization: "O0",
  });

  function handleCompile() {
    setIsCompiling(true);

    const useMockData = true;
    if (useMockData) {
      setTimeout(() => {
        setResult(getMockResult(code));
        setIsCompiling(false);
      }, 500);
    } else {
      axios
        .post("/api/compile", {
          code,
          flags,
        })
        .then((response) => {
          setResult(response.data);
        })
        .catch((error) => {
          setResult({
            success: false,
            output: `Erro na compilação: ${
              error instanceof Error ? error.message : "Erro desconhecido"
            }`,
            assembly: "",
            binary: "",
          });
        })
        .finally(() => {
          setIsCompiling(false);
        });
    }
  }

  function updateFlag(key: keyof CompilerFlags, value: boolean | string) {
    setFlags((prev) => ({ ...prev, [key]: value }));
  }

  function getCompilerCommand() {
    const flagsArray = [];
    if (flags.wall) flagsArray.push("-Wall");
    if (flags.werror) flagsArray.push("-Werror");
    if (flags.debug) flagsArray.push("-g");
    if (flags.static) flagsArray.push("-static");
    flagsArray.push(`-${flags.optimization}`);

    return `gcc ${flagsArray.join(" ")} main.c -o main`;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Cabeçalho */}
      <div className="border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-6 w-6" />
            <h1 className="text-xl font-semibold">GCC Playground</h1>
          </div>
          <div className="text-sm text-muted-foreground font-mono">
            {getCompilerCommand()}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Editor de Código */}
        <div className="flex-1 flex flex-col border-r min-w-0">
          <div className="border-b px-4 py-2 bg-muted/50">
            <h2 className="text-sm font-medium flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              main.c
            </h2>
          </div>
          <div className="flex-1">
            <CodeEditor
              value={code}
              onChange={setCode}
            />
          </div>
        </div>

        {/* Configuração do Compilador */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-gray-50">
          <div className="border-b px-4 py-2 bg-muted/50">
            <h2 className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuração do Compilador
            </h2>
          </div>

          {/* Botão Compilar */}
          <div className="p-4 border-b">
            <Button
              onClick={handleCompile}
              disabled={isCompiling}
              className="w-full"
              size="lg">
              <Play className="h-4 w-4 mr-2" />
              {isCompiling ? "Compilando..." : "Compilar"}
            </Button>
          </div>

          <div className="flex-1 p-4 space-y-6 overflow-auto">
            {/* Flags de Aviso */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Flags de Aviso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="wall"
                    className="text-sm">
                    -Wall
                  </Label>
                  <Switch
                    id="wall"
                    checked={flags.wall}
                    onCheckedChange={(checked) => updateFlag("wall", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="werror"
                    className="text-sm">
                    -Werror
                  </Label>
                  <Switch
                    id="werror"
                    checked={flags.werror}
                    onCheckedChange={(checked) => updateFlag("werror", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Debug e Static */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Outras Flags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="debug"
                    className="text-sm">
                    -g (Info de debug)
                  </Label>
                  <Switch
                    id="debug"
                    checked={flags.debug}
                    onCheckedChange={(checked) => updateFlag("debug", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="static"
                    className="text-sm">
                    -static
                  </Label>
                  <Switch
                    id="static"
                    checked={flags.static}
                    onCheckedChange={(checked) => updateFlag("static", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Nível de Otimização */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Nível de Otimização</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={flags.optimization}
                  onValueChange={(value) => updateFlag("optimization", value)}
                  className="space-y-2">
                  {[
                    { value: "O0", label: "-O0 (Sem otimização)" },
                    { value: "O1", label: "-O1 (Otimização básica)" },
                    { value: "O2", label: "-O2 (Otimização padrão)" },
                    { value: "O3", label: "-O3 (Otimização agressiva)" },
                    { value: "Os", label: "-Os (Otimização de tamanho)" },
                    { value: "Ofast", label: "-Ofast (Mais rápida)" },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={opt.value}
                        id={opt.value}
                      />
                      <Label
                        htmlFor={opt.value}
                        className="text-sm cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Resultados da Compilação */}
      <div className="h-80 flex-shrink-0 border-t flex flex-col bg-white">
        <div className="border-b px-4 py-2 bg-muted/50">
          <h2 className="text-sm font-medium flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Resultados da Compilação
          </h2>
        </div>

        <Tabs
          defaultValue="output"
          className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
            <TabsTrigger
              value="output"
              className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Saída / Erros
            </TabsTrigger>
            <TabsTrigger
              value="assembly"
              className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              Dump Assembly
            </TabsTrigger>
            <TabsTrigger
              value="binary"
              className="flex items-center gap-2">
              <Binary className="h-4 w-4" />
              Saída Binária
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            {/* Aba de Saída */}
            <TabsContent
              value="output"
              className="h-full m-0 p-4">
              <div className="h-full overflow-auto">
                {result ? (
                  <div className="h-full">
                    <Editor
                      height="100%"
                      language="plaintext"
                      value={result.output}
                      theme="gccPlaygroundLight"
                      beforeMount={defineCustomTheme}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 12,
                        fontFamily:
                          "JetBrains Mono, Consolas, Monaco, monospace",
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        wordWrap: "on",
                        wrappingStrategy: "advanced",
                        renderWhitespace: "none",
                        folding: false,
                        glyphMargin: false,
                        lineDecorationsWidth: 8,
                        lineNumbersMinChars: 4,
                        scrollbar: {
                          verticalScrollbarSize: 8,
                          horizontalScrollbarSize: 8,
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Clique em "Compilar" para ver a saída da compilação e erros
                    aqui.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Aba Assembly */}
            <TabsContent
              value="assembly"
              className="h-full m-0 p-4">
              <div className="h-full overflow-auto">
                {result ? (
                  result.success ? (
                    <div className="h-full">
                      <Editor
                        height="100%"
                        language="plaintext"
                        value={result.assembly}
                        theme="gccPlaygroundLight"
                        beforeMount={defineCustomTheme}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 12,
                          fontFamily:
                            "JetBrains Mono, Consolas, Monaco, monospace",
                          lineNumbers: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          wordWrap: "off",
                          renderWhitespace: "none",
                          folding: false,
                          glyphMargin: false,
                          lineDecorationsWidth: 8,
                          lineNumbersMinChars: 4,
                          scrollbar: {
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      O dump assembly não está disponível devido a falha na
                      compilação.
                    </div>
                  )
                ) : (
                  <div className="text-sm text-muted-foreground">
                    O dump assembly aparecerá aqui após compilação bem-sucedida.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Aba Binário */}
            <TabsContent
              value="binary"
              className="h-full m-0 p-4">
              <div className="h-full overflow-auto">
                {result ? (
                  result.success ? (
                    <div className="h-full">
                      <Editor
                        height="100%"
                        language="plaintext"
                        value={result.binary}
                        theme="gccPlaygroundLight"
                        beforeMount={defineCustomTheme}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 12,
                          fontFamily:
                            "JetBrains Mono, Consolas, Monaco, monospace",
                          lineNumbers: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          wordWrap: "on",
                          wrappingStrategy: "advanced",
                          renderWhitespace: "none",
                          folding: false,
                          glyphMargin: false,
                          lineDecorationsWidth: 8,
                          lineNumbersMinChars: 4,
                          scrollbar: {
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      A saída binária não está disponível devido a falha na
                      compilação.
                    </div>
                  )
                ) : (
                  <div className="text-sm text-muted-foreground">
                    A saída binária aparecerá aqui após compilação bem-sucedida.
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
