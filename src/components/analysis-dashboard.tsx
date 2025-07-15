'use client';

import type { AnalyzeResumeOutput } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Lightbulb, Star } from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: AnalyzeResumeOutput;
}

export function AnalysisDashboard({ analysis }: AnalysisDashboardProps) {
  return (
    <div className="space-y-8">
      <Card className="w-full text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline tracking-tight">Your Resume Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
            <div className="absolute flex h-28 w-28 items-center justify-center rounded-full bg-primary/20">
              <span className="font-headline text-5xl font-bold text-primary">{analysis.resumeScore}</span>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">out of 100</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Star className="h-6 w-6 text-yellow-500" />
            <CardTitle className="font-headline">Strong Skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {analysis.strongSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <CardTitle className="font-headline">Missing Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {analysis.missingElements.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Lightbulb className="h-6 w-6 text-accent" />
            <CardTitle className="font-headline">Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {analysis.suggestionsForImprovement.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                   <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
