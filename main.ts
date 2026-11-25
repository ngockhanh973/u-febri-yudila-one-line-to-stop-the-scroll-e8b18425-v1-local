import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// The single line this entry submits. It stays exactly as written here;
// every check below runs against this same value, never a second copy.
const LINE = "I texted my landlord 'I love you' instead of my girlfriend, and he replied 'rent's due Friday, but same.'";

// Look through the line one character at a time and say whether anything
// besides blank space is actually there. A line of only spaces would pass
// a length test but still be an empty submission, so this catches that.
function hasRealContent(text: string): boolean {
  for (const ch of text) {
    if (ch !== " " && ch !== "\t" && ch !== "\n" && ch !== "\r") {
      return true;
    }
  }
  return false;
}

// The bounty caps the line at 200 characters and forbids an empty one,
// so this is the second gate: the line must sit inside 1..200 inclusive.
function fitsLengthLimit(text: string, cap: number = 200): boolean {
  return text.length >= 1 && text.length <= cap;
}

// Where the finished entry goes. The grader may point somewhere else
// through MAKEFUN_OUTPUT_DIR; otherwise the local `out` folder is used.
function pickOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.length > 0) {
    return fromEnv;
  }
  return "out";
}

// Run both gates, then write the exact line out with no trailing newline,
// so the file on disk is byte-for-byte the submitted line.
function main(): void {
  if (!hasRealContent(LINE)) {
    throw new Error("entry line is blank");
  }
  if (!fitsLengthLimit(LINE)) {
    throw new Error("entry line must be 1..200 characters");
  }
  const dir = pickOutputDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, LINE);
  console.log(`wrote ${LINE.length} characters to ${target}`);
}

main();
