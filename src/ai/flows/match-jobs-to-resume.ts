// src/ai/flows/match-jobs-to-resume.ts
'use server';

/**
 * @fileOverview Matches job listings to a user's resume based on skills and experience.
 *
 * - matchJobsToResume - A function that takes resume analysis data and returns a ranked list of job matches.
 * - MatchJobsToResumeInput - The input type for the matchJobsToResume function.
 * - MatchJobsToResumeOutput - The return type for the matchJobsToResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobSchema = z.object({
  jobTitle: z.string().describe('The title of the job.'),
  companyName: z.string().describe('The name of the company offering the job.'),
  jobDescription: z.string().describe('A detailed description of the job responsibilities and requirements.'),
  requiredSkills: z.array(z.string()).describe('A list of skills required for the job.'),
  // Assuming a simplified job listing structure.  Adjust as needed for real-world API data.
});

const MatchJobsToResumeInputSchema = z.object({
  resumeText: z.string().describe('The text content extracted from the user\'s resume.'),
  skills: z.array(z.string()).describe('A list of skills identified in the user\'s resume.'),
  experienceLevel: z.string().describe('The user\'s experience level (e.g., Entry-level, Mid-level, Senior-level).'),
  jobListings: z.array(JobSchema).describe('A list of job listings to match against the resume.'),
});

export type MatchJobsToResumeInput = z.infer<typeof MatchJobsToResumeInputSchema>;

const JobMatchResultSchema = z.object({
  jobTitle: z.string().describe('The title of the job.'),
  companyName: z.string().describe('The name of the company.'),
  matchScore: z.number().describe('A score indicating how well the job matches the resume (0-100).'),
  requiredSkills: z.array(z.string()).describe('The skills required for the job'),
});

const MatchJobsToResumeOutputSchema = z.array(JobMatchResultSchema).describe('A ranked list of job matches with match scores.');

export type MatchJobsToResumeOutput = z.infer<typeof MatchJobsToResumeOutputSchema>;

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
