'use client';

import type { MatchJobsToResumeOutput } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Building, ExternalLink } from 'lucide-react';

interface JobListingsProps {
  jobs: MatchJobsToResumeOutput;
}

export function JobListings({ jobs }: JobListingsProps) {
  if (jobs.length === 0) {
    return (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4 font-headline">No Jobs Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">We couldn't find any job matches for this resume. Try uploading a different one.</p>
            </CardContent>
        </Card>
    )
  }
  
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job, index) => (
        <Card key={`${job.jobTitle}-${index}`} className="flex flex-col justify-between shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader>
            <div className="mb-4 flex items-center gap-4">
               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <Building className="h-6 w-6 text-muted-foreground" />
               </div>
               <div>
                  <CardTitle className="font-headline text-xl">{job.jobTitle}</CardTitle>
                  <CardDescription>{job.companyName}</CardDescription>
               </div>
            </div>
            
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Match Score: {job.matchScore}%</p>
              <Progress value={job.matchScore} aria-label={`${job.matchScore}% match score`} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm font-semibold">Key Skills:</p>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.slice(0, 5).map((skill, i) => (
                <Badge key={`${skill}-${i}`} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <a href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.jobTitle + ' ' + job.companyName)}`} target="_blank" rel="noopener noreferrer">
                View Job <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}


export function JobListingsSkeleton() {
    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <CardHeader>
              <div className="mb-4 flex items-center gap-4">
                 <Skeleton className="h-12 w-12 rounded-lg" />
                 <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                 </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-2.5 w-full" />
              </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-1/3 mb-3" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
