'use server';

/**
 * @fileOverview An AI agent that analyzes a resume and provides feedback.
 *
 * - analyzeResume - A function that handles the resume analysis process.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeResumeInputSchema,
  AnalyzeResumeOutputSchema,
  type AnalyzeResumeInput,
  type AnalyzeResumeOutput,
} from '@/ai/schemas';

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an AI resume analysis expert. Analyze the resume provided and provide a score out of 100, identify strong skills, point out missing elements, and provide suggestions for improvement.\n\nResume: {{media url=resumeDataUri}}`,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
