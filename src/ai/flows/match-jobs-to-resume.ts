'use server';

/**
 * @fileOverview Matches job listings to a user's resume based on skills and experience.
 *
 * - matchJobsToResume - A function that takes resume analysis data and returns a ranked list of job matches.
 */

import {ai} from '@/ai/genkit';
import {
  MatchJobsToResumeInputSchema,
  MatchJobsToResumeOutputSchema,
  type MatchJobsToResumeInput,
  type MatchJobsToResumeOutput,
} from '@/ai/schemas';

export async function matchJobsToResume(input: MatchJobsToResumeInput): Promise<MatchJobsToResumeOutput> {
  return matchJobsToResumeFlow(input);
}

const matchJobsToResumePrompt = ai.definePrompt({
  name: 'matchJobsToResumePrompt',
  input: {schema: MatchJobsToResumeInputSchema},
  output: {schema: MatchJobsToResumeOutputSchema},
  prompt: `You are an AI job matching expert. Given a resume and a list of job listings, your task is to rank the jobs based on how well they match the resume.

  Resume Text: {{{resumeText}}}
  Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Experience Level: {{{experienceLevel}}}

  Here are the job listings:
  {{#each jobListings}}
  Job Title: {{{jobTitle}}}
  Company: {{{companyName}}}
  Description: {{{jobDescription}}}
  Required Skills: {{#each requiredSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  ---
  {{/each}}

  Evaluate each job listing and assign a match score (0-100) based on the relevance of the resume's skills and experience to the job requirements. Consider both the presence of required skills and the overall fit of the resume text to the job description.  List the matched jobs in order of match score, highest to lowest.
  Return only an array of JSON objects, each with jobTitle, companyName, matchScore and requiredSkills. Do not return any other text.`,
});

const matchJobsToResumeFlow = ai.defineFlow(
  {
    name: 'matchJobsToResumeFlow',
    inputSchema: MatchJobsToResumeInputSchema,
    outputSchema: MatchJobsToResumeOutputSchema,
  },
  async input => {
    const {output} = await matchJobsToResumePrompt(input);
    return output!;
  }
);
