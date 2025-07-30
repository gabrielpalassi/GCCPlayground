export interface CompilerFlags {
  wall: boolean;
  werror: boolean;
  debug: boolean;
  static: boolean;
  optimization: "O0" | "O1" | "O2" | "O3" | "Os" | "Ofast";
}

export interface Result {
  success: boolean;
  output: string;
  assembly: string;
  binary: string;
}
