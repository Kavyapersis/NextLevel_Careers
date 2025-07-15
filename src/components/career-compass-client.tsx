'use client';

import { useState } from 'react';
import type { AnalyzeResumeOutput, MatchJobsToResumeOutput } from '@/lib/types';
import { processResumeAndFindJobs } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Compass, Briefcase, FileText } from 'lucide-react';
import { ResumeUploader } from './resume-uploader';
import { AnalysisDashboard } from './analysis-dashboard';
import { JobListings, JobListingsSkeleton } from './job-listings';
import { Separator } from '@/components/ui/separator';

type Status = 'idle' | 'analyzing' | 'error' | 'done';

export function CareerCompassClient() {
  const [status, setStatus] = useState<Status>('idle');
  const [analysis, setAnalysis] = useState<AnalyzeResumeOutput | null>(null);
  const [jobs, setJobs] = useState<MatchJobsToResumeOutput | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setStatus('analyzing');
    setAnalysis(null);
    setJobs(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const resumeDataUri = reader.result as string;
        const result = await processResumeAndFindJobs(resumeDataUri);
        setAnalysis(result.analysis);
        setJobs(result.jobs);
        setStatus('done');
      } catch (error) {
        setStatus('error');
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'Something went wrong while analyzing your resume. Please try again.',
        });
        setStatus('idle');
      }
    };
    reader.onerror = () => {
      setStatus('error');
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: 'Could not read the uploaded file. Please check the file and try again.',
      });
      setStatus('idle');
    };
  };

  const handleReset = () => {
    setStatus('idle');
    setAnalysis(null);
    setJobs(null);
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Compass className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-2xl font-bold text-foreground">CareerCompass</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          {status === 'idle' && (
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                Navigate Your Career Path with AI
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Upload your resume to get an instant, in-depth analysis and discover job opportunities perfectly matched to your skills.
              </p>
              <div className="mt-8">
                <ResumeUploader onFileUpload={handleFileUpload} isLoading={status === 'analyzing'} />
              </div>
            </div>
          )}

          {status === 'analyzing' && (
            <div>
              <div className="mb-8 flex items-center justify-center gap-2 text-lg text-muted-foreground">
                <FileText className="h-5 w-5 animate-pulse" />
                <p className="font-headline">Analyzing your resume...</p>
              </div>
               <JobListingsSkeleton />
            </div>
          )}

          {status === 'done' && analysis && (
             <div className="space-y-12">
               <div>
                  <div className="mb-8 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <FileText className="h-7 w-7 text-primary" />
                        <h2 className="font-headline text-3xl font-bold tracking-tight">Resume Analysis</h2>
                     </div>
                     <button onClick={handleReset} className="text-sm text-primary hover:underline">Analyze another resume</button>
                  </div>
                 <AnalysisDashboard analysis={analysis} />
               </div>

               <Separator />

               <div>
                 <div className="mb-8 flex items-center gap-3">
                    <Briefcase className="h-7 w-7 text-primary" />
                    <h2 className="font-headline text-3xl font-bold tracking-tight">Job Matches</h2>
                 </div>
                 {jobs ? <JobListings jobs={jobs} /> : <JobListingsSkeleton />}
               </div>
             </div>
          )}
        </div>
      </main>
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground md:px-6">
          <p>&copy; {new Date().getFullYear()} CareerCompass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
