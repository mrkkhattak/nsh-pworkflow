'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingDown, TrendingUp, Activity, Heart, AlertCircle, Users, UserCheck, ThumbsUp } from 'lucide-react';
import {
  getPatientOutcomeStats,
  getPatientOutcomeTrends,
  getCurrentQuarterStats,
  getSmokingStatusLabel,
  PatientOutcomeStats,
} from '@/lib/outcome-measures-mock';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart, Legend } from 'recharts';
import { useState } from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  change?: { value: number; percentage: number; direction: 'up' | 'down' | 'stable' };
  benchmark: number;
  lowerIsBetter?: boolean;
}

function MetricCard({ title, value, unit, icon, change, benchmark, lowerIsBetter = true }: MetricCardProps) {
  const isAboveBenchmark = value > benchmark;
  const performanceColor = lowerIsBetter
    ? (isAboveBenchmark ? 'text-red-600' : 'text-green-600')
    : (isAboveBenchmark ? 'text-green-600' : 'text-red-600');

  const trendColor = change
    ? lowerIsBetter
      ? (change.direction === 'down' ? 'text-green-600' : change.direction === 'up' ? 'text-red-600' : 'text-gray-600')
      : (change.direction === 'up' ? 'text-green-600' : change.direction === 'down' ? 'text-red-600' : 'text-gray-600')
    : 'text-gray-600';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          {change ? (
            <div className={`flex items-center text-xs ${trendColor}`}>
              {change.direction === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
              {change.direction === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
              <span>{Math.abs(change.percentage)}% vs prev quarter</span>
            </div>
          ) : (
            <div className="text-xs text-gray-500">No previous data</div>
          )}
          <div className={`text-xs ${performanceColor}`}>
            {lowerIsBetter
              ? (isAboveBenchmark ? 'Above' : 'Below')
              : (isAboveBenchmark ? 'Above' : 'Below')
            } benchmark ({benchmark})
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PatientOutcomeMeasuresProps {
  patientId: string;
}

export function PatientOutcomeMeasures({ patientId }: PatientOutcomeMeasuresProps) {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedQuarter, setSelectedQuarter] = useState('Q3');

  const patientStats = getPatientOutcomeStats(patientId);
  const cohortStats = getCurrentQuarterStats();
  const trendData = getPatientOutcomeTrends(patientId, 2024, 'Q1', 2025, 'Q3');

  if (!patientStats || !cohortStats) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-500 mb-2">No outcome measures data available for this patient.</p>
            <p className="text-xs text-gray-400">Data will appear once quarterly outcomes are recorded.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { latest } = patientStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Outcome Measures</h2>
          <p className="text-muted-foreground">Track key health outcomes for this patient over time</p>
        </div>
        <Button variant="outline" size="sm">Export Report</Button>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="outline" className="text-sm">
          Current Period: {latest.quarter} {latest.year}
        </Badge>
        <Badge variant={latest.riskLevel === 'high' ? 'destructive' : latest.riskLevel === 'medium' ? 'secondary' : 'outline'}>
          Risk Level: {latest.riskLevel}
        </Badge>
        <Badge variant="outline">Primary Dimension: {latest.primaryDimension}</Badge>
        <Badge variant={latest.smokingStatus === 'current' ? 'destructive' : latest.smokingStatus === 'former' ? 'secondary' : 'outline'}>
          Smoking: {getSmokingStatusLabel(latest.smokingStatus)}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="30-Day Readmissions"
          value={latest.readmissions}
          unit="events"
          icon={<AlertCircle className="h-4 w-4" />}
          change={patientStats.readmissionsChange}
          benchmark={cohortStats.benchmark.readmissions}
          lowerIsBetter={true}
        />
        <MetricCard
          title="Hospitalizations"
          value={latest.hospitalizations}
          unit="events"
          icon={<Activity className="h-4 w-4" />}
          change={patientStats.hospitalizationsChange}
          benchmark={cohortStats.benchmark.hospitalizations}
          lowerIsBetter={true}
        />
        <MetricCard
          title="ED Visits"
          value={latest.edVisits}
          unit="visits"
          icon={<Heart className="h-4 w-4" />}
          change={patientStats.edVisitsChange}
          benchmark={cohortStats.benchmark.edVisits}
          lowerIsBetter={true}
        />
        <MetricCard
          title="Functional Capacity"
          value={latest.functionalCapacity}
          unit="score"
          icon={<Users className="h-4 w-4" />}
          change={patientStats.functionalCapacityChange}
          benchmark={cohortStats.benchmark.functionalCapacity}
          lowerIsBetter={false}
        />
        <MetricCard
          title="Patient Engagement"
          value={latest.engagementScore}
          unit="score"
          icon={<UserCheck className="h-4 w-4" />}
          change={patientStats.engagementScoreChange}
          benchmark={cohortStats.benchmark.engagementScore}
          lowerIsBetter={true}
        />
        <MetricCard
          title="Patient Satisfaction"
          value={latest.satisfactionScore}
          unit="score"
          icon={<ThumbsUp className="h-4 w-4" />}
          change={patientStats.satisfactionScoreChange}
          benchmark={cohortStats.benchmark.satisfactionScore}
          lowerIsBetter={true}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Readmissions Trend</CardTitle>
            <CardDescription>30-day readmissions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="readmissions" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hospitalizations Trend</CardTitle>
            <CardDescription>Hospitalizations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hospitalizations" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ED Visits Trend</CardTitle>
            <CardDescription>Emergency department visits over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="edVisits" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Functional Capacity Trend</CardTitle>
            <CardDescription>Functional capacity score over time (higher is better)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="functionalCapacity" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Engagement Trend</CardTitle>
            <CardDescription>Patient engagement score over time (lower is better)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="engagementScore" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Satisfaction Trend</CardTitle>
            <CardDescription>Patient satisfaction score over time (lower is better)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="satisfactionScore" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient vs. Cohort Benchmark</CardTitle>
          <CardDescription>Current quarter performance comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  metric: 'Readmissions',
                  'This Patient': latest.readmissions,
                  'Cohort Benchmark': cohortStats.benchmark.readmissions,
                },
                {
                  metric: 'Hospitalizations',
                  'This Patient': latest.hospitalizations,
                  'Cohort Benchmark': cohortStats.benchmark.hospitalizations,
                },
                {
                  metric: 'ED Visits',
                  'This Patient': latest.edVisits,
                  'Cohort Benchmark': cohortStats.benchmark.edVisits,
                },
                {
                  metric: 'Functional Capacity',
                  'This Patient': latest.functionalCapacity,
                  'Cohort Benchmark': cohortStats.benchmark.functionalCapacity,
                },
                {
                  metric: 'Engagement',
                  'This Patient': latest.engagementScore,
                  'Cohort Benchmark': cohortStats.benchmark.engagementScore,
                },
                {
                  metric: 'Satisfaction',
                  'This Patient': latest.satisfactionScore,
                  'Cohort Benchmark': cohortStats.benchmark.satisfactionScore,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="This Patient" fill="#3b82f6" />
              <Bar dataKey="Cohort Benchmark" fill="#94a3b8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
