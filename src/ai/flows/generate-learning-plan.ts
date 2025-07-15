'use server';

/**
 * @fileOverview An AI agent that generates a learning plan based on resume analysis and a desired job role.
 *
 * - generateLearningPlan - A function that handles the learning plan generation.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateLearningPlanInputSchema,
    GenerateLearningPlanOutputSchema,
    type GenerateLearningPlanInput,
    type GenerateLearningPlanOutput
} from '@/ai/schemas';

export async function generateLearningPlan(input: GenerateLearningPlanInput): Promise<GenerateLearningPlanOutput> {
  return generateLearningPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningPlanPrompt',
  input: {schema: GenerateLearningPlanInputSchema},
  output: {schema: GenerateLearningPlanOutputSchema},
  prompt: `You are an expert career coach. A user has provided their resume analysis and their desired job role. 

Your task is to compare the user's strong skills and missing elements from their resume with the typical requirements for their desired job role. Based on this comparison, generate a list of "Concepts to Learn/Strengthen". These should be actionable and specific suggestions for skills, technologies, or knowledge areas they should focus on.

Desired Job Role: {{{desiredJobRole}}}

Resume Analysis:
- Strong Skills: {{#each resumeAnalysis.strongSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Missing Elements: {{#each resumeAnalysis.missingElements}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Suggestions for Resume Improvement: {{#each resumeAnalysis.suggestionsForImprovement}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Provide a list of concepts to learn or strengthen to bridge the gap between their current resume and their desired career path.
`,
});

const generateLearningPlanFlow = ai.defineFlow(
  {
    name: 'generateLearningPlanFlow',
    inputSchema: GenerateLearningPlanInputSchema,
    outputSchema: GenerateLearningPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
