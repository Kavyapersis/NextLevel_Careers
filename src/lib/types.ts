import type { AnalyzeResumeOutput, GenerateLearningPlanOutput, MatchJobsToResumeOutput } from '@/ai/schemas';

// This file centralizes types from the AI flows for easier consumption
// by both client and server components.

export type { AnalyzeResumeOutput, MatchJobsToResumeOutput, GenerateLearningPlanOutput };

export interface AppAnalysis {
    analysis: AnalyzeResumeOutput;
    jobs: MatchJobsToResumeOutput | null;
    learningPlan: GenerateLearningPlanOutput;
}
