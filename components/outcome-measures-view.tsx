'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingDown, TrendingUp, Activity, Heart, AlertCircle, Users } from 'lucide-react';
import {
  getCurrentQuarterStats,
  getPreviousQuarterStats,
  getQuarterOverQuarterChange,
  getQuarterlyTrends,
  cohortStatistics,
} from '@/lib/outcome-measures-mock';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Bar, BarChart } from 'recharts';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  change: { value: number; percentage: number; direction: 'up' | 'down' | 'stable' };
  benchmark: number;
  lowerIsBetter?: boolean;
}

function MetricCard({ title, value, unit, icon, change, benchmark, lowerIsBetter = true }: MetricCardProps) {
  const isAboveBenchmark = value > benchmark;
  const performanceColor = lowerIsBetter
    ? (isAboveBenchmark ? 'text-red-600' : 'text-green-600')
    : (isAboveBenchmark ? 'text-green-600' : 'text-red-600');

  const trendColor = lowerIsBetter
    ? (change.direction === 'down' ? 'text-green-600' : change.direction === 'up' ? 'text-red-600' : 'text-gray-600')
    : (change.direction === 'up' ? 'text-green-600' : change.direction === 'down' ? 'text-red-600' : 'text-gray-600');

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
          <div className={`flex items-center text-xs ${trendColor}`}>
            {change.direction === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
            {change.direction === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
            <span>{Math.abs(change.percentage)}% vs prev quarter</span>
          </div>
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

export function OutcomeMeasuresView() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedQuarter, setSelectedQuarter] = useState('Q3');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [dimensionFilter, setDimensionFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const currentStats = getCurrentQuarterStats();
  const previousStats = getPreviousQuarterStats();

  if (!currentStats || !previousStats) {
    return <div>Loading...</div>;
  }

  const readmissionsChange = getQuarterOverQuarterChange(currentStats.avgReadmissions, previousStats.avgReadmissions);
  const hospitalizationsChange = getQuarterOverQuarterChange(currentStats.avgHospitalizations, previousStats.avgHospitalizations);
  const edVisitsChange = getQuarterOverQuarterChange(currentStats.avgEdVisits, previousStats.avgEdVisits);
  const functionalCapacityChange = getQuarterOverQuarterChange(currentStats.avgFunctionalCapacity, previousStats.avgFunctionalCapacity);

  const trendData = getQuarterlyTrends(2024, 'Q1', 2025, 'Q3');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Outcome Measures</h1>
          <p className="text-muted-foreground">Track key health outcomes and performance metrics across your patient population</p>
        </div>
        <Button variant="outline">Export Report</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Year:</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Quarter:</label>
          <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q1">Q1</SelectItem>
              <SelectItem value="Q2">Q2</SelectItem>
              <SelectItem value="Q3">Q3</SelectItem>
              <SelectItem value="Q4">Q4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Dimension:</label>
          <Select value={dimensionFilter} onValueChange={setDimensionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dimensions</SelectItem>
              <SelectItem value="Physical Health">Physical Health</SelectItem>
              <SelectItem value="Mental Health">Mental Health</SelectItem>
              <SelectItem value="Social Determinants">Social Determinants</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Risk Level:</label>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={comparisonMode ? 'default' : 'outline'}
          onClick={() => setComparisonMode(!comparisonMode)}
          size="sm"
        >
          Compare Q/Q
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="30-Day Readmissions"
          value={currentStats.avgReadmissions}
          unit="per patient"
          icon={<AlertCircle className="h-4 w-4" />}
          change={readmissionsChange}
          benchmark={currentStats.benchmark.readmissions}
          lowerIsBetter={true}
        />
        <MetricCard
          title="Hospitalizations"
          value={currentStats.avgHospitalizations}
          unit="per patient"
          icon={<Activity className="h-4 w-4" />}
          change={hospitalizationsChange}
          benchmark={currentStats.benchmark.hospitalizations}
          lowerIsBetter={true}
        />
        <MetricCard
          title="ED Visits"
          value={currentStats.avgEdVisits}
          unit="per patient"
          icon={<Heart className="h-4 w-4" />}
          change={edVisitsChange}
          benchmark={currentStats.benchmark.edVisits}
          lowerIsBetter={true}
        />
        <MetricCard
          title="Functional Capacity"
          value={currentStats.avgFunctionalCapacity}
          unit="score"
          icon={<Users className="h-4 w-4" />}
          change={functionalCapacityChange}
          benchmark={currentStats.benchmark.functionalCapacity}
          lowerIsBetter={false}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Readmissions Trend</CardTitle>
            <CardDescription>Average 30-day readmissions per patient over time</CardDescription>
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
            <CardDescription>Average hospitalizations per patient over time</CardDescription>
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
            <CardDescription>Average emergency department visits per patient over time</CardDescription>
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
            <CardDescription>Average functional capacity score over time (higher is better)</CardDescription>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cohort Performance Comparison</CardTitle>
          <CardDescription>Current quarter performance vs. national benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  metric: 'Readmissions',
                  'Your Cohort': currentStats.avgReadmissions,
                  'Benchmark': currentStats.benchmark.readmissions,
                },
                {
                  metric: 'Hospitalizations',
                  'Your Cohort': currentStats.avgHospitalizations,
                  'Benchmark': currentStats.benchmark.hospitalizations,
                },
                {
                  metric: 'ED Visits',
                  'Your Cohort': currentStats.avgEdVisits,
                  'Benchmark': currentStats.benchmark.edVisits,
                },
                {
                  metric: 'Functional Capacity',
                  'Your Cohort': currentStats.avgFunctionalCapacity,
                  'Benchmark': currentStats.benchmark.functionalCapacity,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Your Cohort" fill="#3b82f6" />
              <Bar dataKey="Benchmark" fill="#94a3b8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
