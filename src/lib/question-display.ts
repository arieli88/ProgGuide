const HEBREW = /[\u0590-\u05FF]/;

export function isCodeLikeAnswer(text: string): boolean {
  const t = text.trim();
  if (!t || HEBREW.test(t)) return false;
  if (/^(true|false|null|\d+)$/.test(t)) return true;
  if (/^".*"$/.test(t)) return true;
  if (/^(Base|Derived|Dog|Animal|A|B|C|X|D|F|DF|Int|String|None|Paper|Plastic|PaperPlastic|PlasticPaper)$/i.test(t)) return true;
  if (/^[A-Za-z0-9+:_\-./\\ ]+$/.test(t) && t.length <= 48) return true;
  if (/\b(class|Console|public|void|int|string|SELECT|INSERT|UPDATE|using|override|virtual)\b/.test(t)) return true;
  if (/[{}();]/.test(t)) return true;
  return false;
}

export function shouldUseCodeBlock(text: string): boolean {
  const t = text.trim();
  return t.includes("\n") || t.length > 36 || /\b(class|SELECT|Console\.|MySql)\b/.test(t);
}

export function splitQuestionPrompt(question: string): { prompt: string; code?: string } {
  const marker = question.indexOf("Code:");
  if (marker >= 0) {
    return {
      prompt: question.slice(0, marker).trim(),
      code: question.slice(marker + 5).trim(),
    };
  }
  const lines = question.split("\n");
  const codeStart = lines.findIndex((l) => /^\s*(class|int|interface|abstract|try|MySql|Ticket|Flight|Passenger|List<)/.test(l));
  if (codeStart > 0) {
    return {
      prompt: lines.slice(0, codeStart).join("\n").trim(),
      code: lines.slice(codeStart).join("\n").trim(),
    };
  }
  return { prompt: question };
}
