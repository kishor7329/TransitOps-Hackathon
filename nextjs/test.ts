// import { askGemini } from "./lib/ai/gemini";

// async function main() {
//   const answer = await askGemini("Say Hello in one sentence.");

//   console.log(answer);
// }

// main();

// import "dotenv/config";
// import { askGemini } from "./lib/ai/gemini";

// async function main() {
//   try {
//     const answer = await askGemini("Say hello in one sentence.");
//     console.log(answer);
//   } catch (err) {
//     console.error("FULL ERROR:");
//     console.dir(err, { depth: null });
//   }
// }

// main();

import "dotenv/config";

import { chat } from "./lib/ai/chat";

async function main() {
  const response = await chat(
    "Which vehicle is available for a 450kg shipment?"
  );

  console.log(response);
}

main();