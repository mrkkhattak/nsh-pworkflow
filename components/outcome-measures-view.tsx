'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingDown, TrendingUp, Activity, Heart, AlertCircle, Users, Cigarette, CigaretteOff, UserCheck, ThumbsUp } from 'lucide-react';
import {
  getCurrentQuarterStats,
  getPreviousQuarterStats,
  getQuarterOverQuarterChange,
  getQuarterlyTrends,
  cohortStatistics,
  getSmokingStatusDistribution,
  getSmokingStatusLabel,
  getPatientOutcomes,
  getPatientOutcomeTrends,
  quarterlyOutcomeData,
} from '@/lib/outcome-measures-mock';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Bar, BarChart, ReferenceLine } from 'recharts';

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
  const [smokingFilter, setSmokingFilter] = useState('all');
  const [patientFilter, setPatientFilter] = useState('all');

  const currentStats = getCurrentQuarterStats();
  const previousStats = getPreviousQuarterStats();

  if (!currentStats || !previousStats) {
    return <div>Loading...</div>;
  }

  const allPatients = Array.from(new Set(quarterlyOutcomeData.map(d => ({ id: d.patientId, name: d.patientName })).map(p => JSON.stringify(p)))).map(p => JSON.parse(p));

  const isPatientView = patientFilter !== 'all';
  const selectedPatientData = isPatientView ? getPatientOutcomes(patientFilter).find(o => o.quarter === 'Q3' && o.year === 2025) : null;

  const readmissionsChange = getQuarterOverQuarterChange(currentStats.avgReadmissions, previousStats.avgReadmissions);
  const hospitalizationsChange = getQuarterOverQuarterChange(currentStats.avgHospitalizations, previousStats.avgHospitalizations);
  const edVisitsChange = getQuarterOverQuarterChange(currentStats.avgEdVisits, previousStats.avgEdVisits);
  const functionalCapacityChange = getQuarterOverQuarterChange(currentStats.avgFunctionalCapacity, previousStats.avgFunctionalCapacity);
  const engagementScoreChange = getQuarterOverQuarterChange(currentStats.avgEngagementScore, previousStats.avgEngagementScore);
  const satisfactionScoreChange = getQuarterOverQuarterChange(currentStats.avgSatisfactionScore, previousStats.avgSatisfactionScore);

  const trendData = isPatientView ? getPatientOutcomeTrends(patientFilter, 2024, 'Q1', 2025, 'Q3') : getQuarterlyTrends(2024, 'Q1', 2025, 'Q3');
  const smokingDistribution = getSmokingStatusDistribution('Q3', 2025);

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

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Patient:</label>
          <Select value={patientFilter} onValueChange={setPatientFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients (Cohort)</SelectItem>
              {allPatients.map(patient => (
                <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
              ))}
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

      <Card>
        <CardHeader>
          <CardTitle>Smoking Status Distribution</CardTitle>
          <CardDescription>Current quarter patient smoking status breakdown</CardDescription>
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
            <CardDescription>{isPatientView ? '30-day readmissions over time' : 'Average 30-day readmissions per patient over time'}</CardDescription>
            {isPatientView && selectedPatientData && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Risk Category:</span>
                  <Badge variant={selectedPatientData.riskLevel === 'high' ? 'destructive' : selectedPatientData.riskLevel === 'medium' ? 'secondary' : 'outline'}>
                    {selectedPatientData.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Score:</span>
                  <span className="text-lg font-semibold">{selectedPatientData.readmissions.toFixed(1)} events</span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString();
                  }}
                />
                {isPatientView && <Legend />}
                {isPatientView && <ReferenceLine y={currentStats.benchmark.readmissions} stroke="#94a3b8" strokeDasharray="5 5" label="Benchmark" />}
                <Line type="monotone" dataKey="readmissions" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name={isPatientView ? 'Patient' : 'Cohort Avg'} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hospitalizations Trend</CardTitle>
            <CardDescription>{isPatientView ? 'Hospitalizations over time' : 'Average hospitalizations per patient over time'}</CardDescription>
            {isPatientView && selectedPatientData && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Risk Category:</span>
                  <Badge variant={selectedPatientData.riskLevel === 'high' ? 'destructive' : selectedPatientData.riskLevel === 'medium' ? 'secondary' : 'outline'}>
                    {selectedPatientData.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Score:</span>
                  <span className="text-lg font-semibold">{selectedPatientData.hospitalizations.toFixed(1)} events</span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString();
                  }}
                />
                {isPatientView && <Legend />}
                {isPatientView && <ReferenceLine y={currentStats.benchmark.hospitalizations} stroke="#94a3b8" strokeDasharray="5 5" label="Benchmark" />}
                <Line type="monotone" dataKey="hospitalizations" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name={isPatientView ? 'Patient' : 'Cohort Avg'} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ED Visits Trend</CardTitle>
            <CardDescription>{isPatientView ? 'Emergency department visits over time' : 'Average emergency department visits per patient over time'}</CardDescription>
            {isPatientView && selectedPatientData && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Risk Category:</span>
                  <Badge variant={selectedPatientData.riskLevel === 'high' ? 'destructive' : selectedPatientData.riskLevel === 'medium' ? 'secondary' : 'outline'}>
                    {selectedPatientData.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Score:</span>
                  <span className="text-lg font-semibold">{selectedPatientData.edVisits.toFixed(1)} visits</span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString();
                  }}
                />
                {isPatientView && <Legend />}
                {isPatientView && <ReferenceLine y={currentStats.benchmark.edVisits} stroke="#94a3b8" strokeDasharray="5 5" label="Benchmark" />}
                <Line type="monotone" dataKey="edVisits" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name={isPatientView ? 'Patient' : 'Cohort Avg'} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Functional Capacity Trend</CardTitle>
            <CardDescription>{isPatientView ? 'Functional capacity score over time (higher is better)' : 'Average functional capacity score over time (higher is better)'}</CardDescription>
            {isPatientView && selectedPatientData && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Risk Category:</span>
                  <Badge variant={selectedPatientData.riskLevel === 'high' ? 'destructive' : selectedPatientData.riskLevel === 'medium' ? 'secondary' : 'outline'}>
                    {selectedPatientData.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Score:</span>
                  <span className="text-lg font-semibold">{selectedPatientData.functionalCapacity.toFixed(1)} score</span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
                  }}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString();
                  }}
                />
                {isPatientView && <Legend />}
                {isPatientView && <ReferenceLine y={currentStats.benchmark.functionalCapacity} stroke="#94a3b8" strokeDasharray="5 5" label="Benchmark" />}
                <Line type="monotone" dataKey="functionalCapacity" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name={isPatientView ? 'Patient' : 'Cohort Avg'} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Engagement Trend</CardTitle>
            <CardDescription>{isPatientView ? 'Patient engagement score over time (lower is better)' : 'Average patient engagement score over time (lower is better)'}</CardDescription>
            {isPatientView && selectedPatientData && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Risk Category:</span>
                  <Badge variant={selectedPatientData.riskLevel === 'high' ? 'destructive' : selectedPatientData.riskLevel === 'medium' ? 'secondary' : 'outline'}>
                    {selectedPatientData.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Score:</span>
                  <span className="text-lg font-semibold">{selectedPatientData.engagementScore.toFixed(1)} score</span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
                  }}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString();
                  }}
                />
                {isPatientView && <Legend />}
                {isPatientView && <ReferenceLine y={currentStats.benchmark.engagementScore} stroke="#94a3b8" strokeDasharray="5 5" label="Benchmark" />}
                <Line type="monotone" dataKey="engagementScore" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} name={isPatientView ? 'Patient' : 'Cohort Avg'} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Satisfaction Trend</CardTitle>
            <CardDescription>{isPatientView ? 'Patient satisfaction score over time (lower is better)' : 'Average patient satisfaction score over time (lower is better)'}</CardDescription>
            {isPatientView && selectedPatientData && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Risk Category:</span>
                  <Badge variant={selectedPatientData.riskLevel === 'high' ? 'destructive' : selectedPatientData.riskLevel === 'medium' ? 'secondary' : 'outline'}>
                    {selectedPatientData.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Score:</span>
                  <span className="text-lg font-semibold">{selectedPatientData.satisfactionScore.toFixed(1)} score</span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
                  }}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString();
                  }}
                />
                {isPatientView && <Legend />}
                {isPatientView && <ReferenceLine y={currentStats.benchmark.satisfactionScore} stroke="#94a3b8" strokeDasharray="5 5" label="Benchmark" />}
                <Line type="monotone" dataKey="satisfactionScore" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} name={isPatientView ? 'Patient' : 'Cohort Avg'} />
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
                {
                  metric: 'Patient Engagement',
                  'Your Cohort': currentStats.avgEngagementScore,
                  'Benchmark': currentStats.benchmark.engagementScore,
                },
                {
                  metric: 'Patient Satisfaction',
                  'Your Cohort': currentStats.avgSatisfactionScore,
                  'Benchmark': currentStats.benchmark.satisfactionScore,
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
