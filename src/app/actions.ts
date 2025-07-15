'use server';

import { analyzeResume } from '@/ai/flows/analyze-resume';
import { matchJobsToResume } from '@/ai/flows/match-jobs-to-resume';
import { mockJobs } from '@/lib/mock-jobs';
import type { AnalyzeResumeOutput, MatchJobsToResumeOutput } from '@/lib/types';

export async function processResumeAndFindJobs(
  resumeDataUri: string
): Promise<{ analysis: AnalyzeResumeOutput; jobs: MatchJobsToResumeOutput | null }> {
  try {
    const analysis = await analyzeResume({ resumeDataUri });

    // Create a summary of the resume from the analysis to feed into the job matcher.
    // This is a workaround because we cannot easily get the raw text from the PDF/DOCX
    // without adding heavy libraries, and the provided AI flows are separate.
    const resumeTextSummary = `
      Skills: ${analysis.strongSkills.join(', ')}.
      Missing from resume: ${analysis.missingElements.join('. ')}.
      Suggestions for resume: ${analysis.suggestionsForImprovement.join('. ')}.
    `;

    // The `experienceLevel` is not provided by the analysis, so we hardcode a reasonable default.
    const experienceLevel = 'Mid-level';

    const jobs = await matchJobsToResume({
      resumeText: resumeTextSummary,
      skills: analysis.strongSkills,
      experienceLevel,
      jobListings: mockJobs,
    });
    
    // Sort jobs by matchScore in descending order
    const sortedJobs = jobs.sort((a, b) => b.matchScore - a.matchScore);

    return { analysis, jobs: sortedJobs };
  } catch (error) {
    console.error('Error processing resume and finding jobs:', error);
    // In a real app, you'd want more robust error handling and user feedback.
    throw new Error('Failed to analyze resume and find jobs.');
  }
}
