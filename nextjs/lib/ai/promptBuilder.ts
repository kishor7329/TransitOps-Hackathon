export function buildPrompt(question: string, context: string) {
  return `
You are Fleet AI, an intelligent assistant for a transport management platform.

Use ONLY the context below to answer.

Context:
${context}

User Question:
${question}

Answer:
`;
}