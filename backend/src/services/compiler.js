import { spawn, exec } from "child_process";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function compileCode(code, flags) {
  const sessionId = uuidv4();
  const tempDir = join(process.cwd(), "temp");
  const sourceFile = join(tempDir, `${sessionId}.c`);
  const outputFile = join(tempDir, `${sessionId}`);
  const assemblyFile = join(tempDir, `${sessionId}.s`);

  try {
    // Ensure temp directory exists
    await ensureTempDir(tempDir);

    // Write source code to file
    await writeFile(sourceFile, code, "utf8");

    // Build GCC command
    const gccFlags = buildGccFlags(flags);
    const gccCommand = `gcc ${gccFlags} "${sourceFile}" -o "${outputFile}"`;

    // Compile the code
    const compileResult = await executeCommand(gccCommand);

    if (compileResult.success) {
      // Generate assembly dump
      const assemblyResult = await generateAssembly(outputFile);

      // Generate binary dump
      const binaryResult = await generateBinaryDump(outputFile);

      return {
        success: true,
        output: compileResult.stdout || "Compilation successful",
        assembly: assemblyResult,
        binary: binaryResult,
      };
    } else {
      return {
        success: false,
        output: compileResult.stderr || "Compilation failed",
        assembly: "",
        binary: "",
      };
    }
  } catch (error) {
    console.error("Compilation error:", error);
    return {
      success: false,
      output: `Compilation error: ${error.message}`,
      assembly: "",
      binary: "",
    };
  } finally {
    // Cleanup temporary files
    await cleanupFiles([sourceFile, outputFile, assemblyFile]);
  }
}

function buildGccFlags(flags) {
  const flagArray = [];

  if (flags.wall) flagArray.push("-Wall");
  if (flags.werror) flagArray.push("-Werror");
  if (flags.debug) flagArray.push("-g");
  if (flags.static) flagArray.push("-static");
  if (flags.optimization) flagArray.push(`-${flags.optimization}`);

  return flagArray.join(" ");
}

async function executeCommand(command) {
  return new Promise((resolve) => {
    const isWindows = process.platform === "win32";
    const shell = isWindows ? "cmd" : "bash";
    const args = isWindows ? ["/c", command] : ["-c", command];

    const shellProcess = spawn(shell, args, {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    shellProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    shellProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    shellProcess.on("close", (code) => {
      resolve({
        success: code === 0,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        code,
      });
    });

    shellProcess.on("error", (error) => {
      resolve({
        success: false,
        stdout: "",
        stderr: error.message,
        code: -1,
      });
    });
  });
}

async function generateAssembly(outputFile) {
  try {
    const command = `objdump -d "${outputFile}" | tail -n +3`;
    const result = await executeCommand(command);

    if (result.success) {
      return result.stdout;
    } else {
      return "Failed to generate assembly dump";
    }
  } catch (error) {
    return `Error generating assembly: ${error.message}`;
  }
}

async function generateBinaryDump(outputFile) {
  try {
    const command = `hexdump -C "${outputFile}"`;
    const result = await executeCommand(command);

    if (result.success) {
      return result.stdout;
    } else {
      return "Failed to generate binary dump";
    }
  } catch (error) {
    return `Error generating binary dump: ${error.message}`;
  }
}

async function ensureTempDir(tempDir) {
  try {
    const { mkdir } = await import("fs/promises");
    await mkdir(tempDir, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

async function cleanupFiles(files) {
  for (const file of files) {
    try {
      await unlink(file);
    } catch (error) {
      // Ignore errors if file doesn't exist
      if (error.code !== "ENOENT") {
        console.error(`Error cleaning up file ${file}:`, error);
      }
    }
  }
}
