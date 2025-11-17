'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cigarette, CigaretteOff } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart } from 'recharts';
import { getOutcomeTrends, getSmokingStatusDistribution, getBenchmarkComparison } from '@/lib/outcome-service';
import type { AssessmentOutcome } from '@/lib/outcome-service';
import { format } from 'date-fns';

export function OutcomeMeasuresView() {
  const [dateRange, setDateRange] = useState('12months');
  const [dimensionFilter, setDimensionFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [smokingFilter, setSmokingFilter] = useState('all');
  const [trendData, setTrendData] = useState<AssessmentOutcome[]>([]);
  const [smokingDistribution, setSmokingDistribution] = useState({ never: 0, former: 0, current: 0, neverPercent: 0, formerPercent: 0, currentPercent: 0 });
  const [benchmarkData, setBenchmarkData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange, dimensionFilter, riskFilter, smokingFilter]);

  async function loadData() {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();

      if (dateRange === '3months') {
        startDate.setMonth(startDate.getMonth() - 3);
      } else if (dateRange === '6months') {
        startDate.setMonth(startDate.getMonth() - 6);
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const [trends, smoking, comparison] = await Promise.all([
        getOutcomeTrends(startDate, endDate, dimensionFilter, riskFilter, smokingFilter),
        getSmokingStatusDistribution(),
        getBenchmarkComparison(),
      ]);

      setTrendData(trends);
      setSmokingDistribution(smoking);
      setBenchmarkData(comparison);
    } catch (error) {
      console.error('Error loading outcome data:', error);
    } finally {
      setLoading(false);
    }
  }

  const chartData = trendData.map(item => ({
    date: format(item.assessmentDate, 'MMM dd, yyyy'),
    readmissions: item.readmissions,
    hospitalizations: item.hospitalizations,
    edVisits: item.edVisits,
    functionalCapacity: item.functionalCapacity,
    engagementScore: item.engagementScore,
    satisfactionScore: item.satisfactionScore,
  }));

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

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
          <label className="text-sm font-medium">Time Range:</label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
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

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Smoking Status:</label>
          <Select value={smokingFilter} onValueChange={setSmokingFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="never">Never Smoked</SelectItem>
              <SelectItem value="former">Former Smoker</SelectItem>
              <SelectItem value="current">Current Smoker</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Smoking Status Distribution</CardTitle>
          <CardDescription>Current patient smoking status breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CigaretteOff className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-900">{smokingDistribution.neverPercent}%</div>
                <div className="text-sm text-green-700">Never Smoked</div>
                <div className="text-xs text-green-600">{smokingDistribution.never} patients</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <CigaretteOff className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">{smokingDistribution.formerPercent}%</div>
                <div className="text-sm text-blue-700">Former Smoker</div>
                <div className="text-xs text-blue-600">{smokingDistribution.former} patients</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Cigarette className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-900">{smokingDistribution.currentPercent}%</div>
                <div className="text-sm text-red-700">Current Smoker</div>
                <div className="text-xs text-red-600">{smokingDistribution.current} patients</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Readmissions Trend</CardTitle>
            <CardDescription>Average 30-day readmissions per patient by assessment date</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
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
            <CardDescription>Average hospitalizations per patient by assessment date</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
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
            <CardDescription>Average emergency department visits per patient by assessment date</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
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
            <CardDescription>Average functional capacity score by assessment date</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
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
            <CardDescription>Average patient engagement score by assessment date</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
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
            <CardDescription>Average patient satisfaction score by assessment date</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
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
          <CardTitle>Cohort Performance Comparison</CardTitle>
          <CardDescription>Performance vs. national benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={benchmarkData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Your Cohort" fill="#3b82f6" />
              <Bar dataKey="Benchmark" fill="#94a3b8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
