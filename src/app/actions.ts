'use server';

import { analyzeResume } from '@/ai/flows/analyze-resume';
import { generateLearningPlan } from '@/ai/flows/generate-learning-plan';
import { matchJobsToResume } from '@/ai/flows/match-jobs-to-resume';
import { mockJobs } from '@/lib/mock-jobs';
import type { AppAnalysis, MatchJobsToResumeOutput } from '@/lib/types';

export async function processResumeAndFindJobs(
  resumeDataUri: string,
  desiredJobRole: string,
): Promise<AppAnalysis> {
  try {
    const analysis = await analyzeResume({ resumeDataUri });

    const learningPlan = await generateLearningPlan({
        resumeAnalysis: analysis,
        desiredJobRole,
    });

    const resumeTextSummary = `
      Skills: ${analysis.strongSkills.join(', ')}.
      Missing from resume: ${analysis.missingElements.join('. ')}.
      Suggestions for resume: ${analysis.suggestionsForImprovement.join('. ')}.
    `;

    const experienceLevel = 'Mid-level';

    const jobs = await matchJobsToResume({
      resumeText: resumeTextSummary,
      skills: analysis.strongSkills,
      experienceLevel,
      jobListings: mockJobs,
    });
    
    const sortedJobs = jobs.sort((a, b) => b.matchScore - a.matchScore);

    return { 
        analysis, 
        jobs: sortedJobs,
        learningPlan,
    };
  } catch (error) {
    console.error('Error processing resume and finding jobs:', error);
    throw new Error('Failed to analyze resume and find jobs.');
  }
}
