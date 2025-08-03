import { NextResponse } from 'next/server';
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatFireworks({
  modelName: "accounts/fireworks/models/llama-v3p3-70b-instruct",
  temperature: 0.5, 
  maxTokens: 2048,
});

const outputParser = new StringOutputParser();

const titlePrompt = PromptTemplate.fromTemplate(
`You are an expert content analyst. Your task is to generate a concise and relevant title for a user's note provided in HTML format.

You must first parse the HTML to understand the semantic meaning of the text, ignoring the HTML tags. Do not include any HTML tags in your final output.

The title must follow these rules:
1. It must accurately summarize the main topic.
2. It must be between 3 and 10 words.
3. It must NOT be enclosed in quotation marks.

Here is the user's note content:
---
{note_content}`
);

const refinePrompt = PromptTemplate.fromTemplate(
`You are an expert editor. Your task is to refine the user's note content provided in HTML format.

Perform the following actions:
1. Correct any spelling mistakes and grammatical errors.
2. Improve sentence structure for better clarity and flow.
3. Fix awkward phrasing to make the text more professional.

You must follow these critical constraints:
1. DO NOT change the core meaning of the user's original text.
2. YOU MUST PRESERVE all original HTML formatting tags, such as <h2>, <strong>, <em>, <ul>, <li>, <blockquote>, and any <span style="color:..."> tags.
3. The output MUST be a single block of valid HTML code. Do not add any commentary.

Here is the user's note content to refine:
---
{note_content}`
);

const titleChain = titlePrompt.pipe(model).pipe(outputParser);
const refineChain = refinePrompt.pipe(model).pipe(outputParser);

export async function POST(req) {
  try {
    const { task, content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    let result;

    switch (task) {
      case 'generate_title':
        result = await titleChain.invoke({ note_content: content });
        break;
      case 'refine_content':
        result = await refineChain.invoke({ note_content: content });
        break;
      default:
        return NextResponse.json({ error: 'Invalid task specified' }, { status: 400 });
    }

    return NextResponse.json({ suggestion: result });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: 'Failed to generate AI content.' }, { status: 500 });
  }
}