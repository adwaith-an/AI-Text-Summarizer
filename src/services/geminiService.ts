import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are an AI Text Summarizer.

Your task is to summarize the given text clearly and effectively.

Follow these rules strictly:

1. Provide a SHORT SUMMARY in 3–5 sentences.
2. Provide KEY POINTS as bullet points.
3. Keep language simple and easy to understand.
4. Do NOT add extra information beyond the given text.
5. If a word limit is provided, strictly follow it.
6. Highlight important ideas, facts, or conclusions.

Output format:

### Summary
[Short paragraph summary]

### Key Points
- Point 1  
- Point 2  
- Point 3  

If the user provides a word limit, adjust the summary accordingly.`;

export async function summarizeText(text: string, wordLimit?: number): Promise<string> {
  let contents = `Text to summarize:\n${text}`;
  if (wordLimit && wordLimit > 0) {
    contents += `\n\nWord limit for summary: ${wordLimit} words`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || 'No summary generated.';
  } catch (error) {
    console.error('Error in summarizeText:', error);
    throw new Error('Failed to generate summary. Please try again.');
  }
}
