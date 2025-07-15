/**
 * @fileOverview Shared Zod schemas and TypeScript types for the NextLevel Careers AI flows.
 * This file does not use 'use server' and can be safely imported into any environment.
 */
import { z } from 'genkit';

// Schema for analyze-resume.ts
export const AnalyzeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

export const AnalyzeResumeOutputSchema = z.object({
  resumeScore: z
    .number()
    .describe('A score out of 100 representing the overall quality of the resume.'),
  strongSkills: z
    .array(z.string())
    .describe('A list of skills that are well-represented in the resume.'),
  missingElements: z
    .array(z.string())
    .describe('A list of elements that are missing or could be improved in the resume.'),
  suggestionsForImprovement: z
    .array(z.string())
    .describe('Specific suggestions for improving the resume.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;


// Schema for generate-learning-plan.ts
export const GenerateLearningPlanInputSchema = z.object({
  resumeAnalysis: AnalyzeResumeOutputSchema.describe('The analysis result from the user\'s resume.'),
  desiredJobRole: z.string().describe('The job role the user is aiming for.'),
});
export type GenerateLearningPlanInput = z.infer<typeof GenerateLearningPlanInputSchema>;

export const GenerateLearningPlanOutputSchema = z.object({
    conceptsToLearn: z.array(z.string()).describe('A list of specific skills, technologies, or knowledge areas the user should learn or strengthen to better qualify for their desired job role.'),
});
export type GenerateLearningPlanOutput = z.infer<typeof GenerateLearningPlanOutputSchema>;


// Schemas for match-jobs-to-resume.ts
const JobSchema = z.object({
    jobTitle: z.string().describe('The title of the job.'),
    companyName: z.string().describe('The name of the company offering the job.'),
    jobDescription: z.string().describe('A detailed description of the job responsibilities and requirements.'),
    requiredSkills: z.array(z.string()).describe('A list of skills required for the job.'),
});
  
export const MatchJobsToResumeInputSchema = z.object({
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
  
export const MatchJobsToResumeOutputSchema = z.array(JobMatchResultSchema).describe('A ranked list of job matches with match scores.');
export type MatchJobsToResumeOutput = z.infer<typeof MatchJobsToResumeOutputSchema>;
