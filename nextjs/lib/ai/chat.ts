import { askGemini } from "./gemini";
import { buildPrompt } from "./promptBuilder";
import { retrieveContext } from "./retriever";

export async function chat(question: string) {
  const context = await retrieveContext(question);

  const prompt = buildPrompt(question, context);

  return await askGemini(prompt);
}