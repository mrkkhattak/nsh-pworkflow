import { outcomeTrackingData } from "./outcome-tracking-data"

export interface OutcomeMetric {
  metricId: string
  metricName: string
  description: string
  currentValue: number | string
  baseline?: number
  target?: number | string
  status: "excellent" | "good" | "needs-attention" | "critical"
  trend: "improving" | "stable" | "declining"
  lastUpdated: string
  measurementUnit: string
  frequency: string
  threshold?: {
    targetValue: string
    benchmarkType: string
  }
}

export interface OutcomeDomain {
  domainId: string
  domainName: string
  metrics: OutcomeMetric[]
}

export interface OutcomeCategory {
  categoryId: string
  categoryName: string
  domains: OutcomeDomain[]
}

function generateMockValue(
  metricId: string,
  dataType: string,
  unit: string
): { current: number | string; baseline?: number; target?: number | string; status: OutcomeMetric["status"]; trend: OutcomeMetric["trend"] } {
  const mockData: Record<string, any> = {
    "QEO-001": { current: 15, baseline: 75, target: 10, status: "good", trend: "improving" },
    "QEO-002": { current: 8, baseline: 5, target: 10, status: "good", trend: "improving" },
    "QEO-003": { current: 35, baseline: 12, target: 30, status: "excellent", trend: "improving" },
    "QEO-004": { current: 28, baseline: 15, target: 25, status: "excellent", trend: "improving" },
    "SUC-001": { current: "Achieved", baseline: "Not Achieved", target: "Achieved", status: "excellent", trend: "stable" },
    "PE-001": { current: 85, baseline: 65, target: 80, status: "excellent", trend: "improving" },
    "PE-002": { current: 92, baseline: 75, target: 90, status: "excellent", trend: "improving" },
    "PE-003": { current: 8, baseline: 5, target: 7, status: "excellent", trend: "improving" },
    "PE-004": { current: 75, baseline: 45, target: 70, status: "excellent", trend: "improving" },
    "PE-005": { current: 68, baseline: 40, target: 75, status: "good", trend: "improving" },
    "RU-001": { current: 78, baseline: 55, target: 75, status: "excellent", trend: "improving" },
    "PS-001": { current: 12, baseline: 0, target: 0, status: "excellent", trend: "improving" },
    "SO-001": { current: 3.2, baseline: 6.5, target: 5, status: "excellent", trend: "improving" },
    "SO-002": { current: 25, baseline: 8, target: 20, status: "excellent", trend: "improving" },
    "PR-001": { current: "Moderate", status: "good", trend: "stable" },
    "PR-002": { current: "Low Risk", status: "excellent", trend: "improving" },
    "PR-003": { current: "Optimal", status: "excellent", trend: "stable" },
    "PR-004": { current: "$3,250", baseline: "$5,200", target: "$2,800", status: "good", trend: "improving" },
    "PR-006": { current: 85, baseline: 60, target: 80, status: "excellent", trend: "improving" },
    "PR-007": { current: 78, baseline: 55, target: 75, status: "excellent", trend: "improving" },
    "PR-008": { current: 82, baseline: 65, target: 80, status: "excellent", trend: "improving" },
    "PR-010": { current: 88, baseline: 65, target: 70, status: "excellent", trend: "improving" },
    "PR-011": { current: "Intermediate", status: "good", trend: "improving" },
    "PR-013": { current: 42, baseline: 68, target: 35, status: "good", trend: "improving" },
    "PR-014": { current: "Moderate Risk Engaged", status: "good", trend: "improving" },
    "PR-015": { current: 76, baseline: 58, target: 80, status: "good", trend: "improving" },
  }

  return mockData[metricId] || { current: "N/A", status: "good", trend: "stable" }
}

export function getOutcomeMetricsByPatient(patientId: number): OutcomeCategory[] {
  const schema = outcomeTrackingData
  const categories: OutcomeCategory[] = []

  for (const category of schema.measureCategories) {
    const outcomeCategory: OutcomeCategory = {
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      domains: [],
    }

    for (const measure of category.measures) {
      const domain: OutcomeDomain = {
        domainId: measure.domain,
        domainName: measure.domainName,
        metrics: [],
      }

      for (const metric of measure.metrics) {
        const mockValues = generateMockValue(
          metric.metricId,
          metric.dataType,
          metric.measurementUnit
        )

        const outcomeMetric: OutcomeMetric = {
          metricId: metric.metricId,
          metricName: metric.metricName,
          description: metric.description,
          currentValue: mockValues.current,
          baseline: mockValues.baseline,
          target: mockValues.target,
          status: mockValues.status,
          trend: mockValues.trend,
          lastUpdated: "2025-01-15",
          measurementUnit: metric.measurementUnit,
          frequency: metric.measurementFrequency || metric.updateFrequency || "monthly",
          threshold: metric.threshold,
        }

        domain.metrics.push(outcomeMetric)
      }

      outcomeCategory.domains.push(domain)
    }

    categories.push(outcomeCategory)
  }

  return categories
}

export function getMetricTrendData(metricId: string): Array<{ date: string; value: number }> {
  const trendData: Record<string, Array<{ date: string; value: number }>> = {
    "QEO-001": [
      { date: "2024-10-01", value: 75 },
      { date: "2024-11-01", value: 65 },
      { date: "2024-12-01", value: 45 },
      { date: "2025-01-01", value: 15 },
    ],
    "PE-001": [
      { date: "2024-10-01", value: 65 },
      { date: "2024-11-01", value: 72 },
      { date: "2024-12-01", value: 78 },
      { date: "2025-01-01", value: 85 },
    ],
    "PE-004": [
      { date: "2024-10-01", value: 45 },
      { date: "2024-11-01", value: 58 },
      { date: "2024-12-01", value: 68 },
      { date: "2025-01-01", value: 75 },
    ],
    "PR-006": [
      { date: "2024-10-01", value: 60 },
      { date: "2024-11-01", value: 68 },
      { date: "2024-12-01", value: 78 },
      { date: "2025-01-01", value: 85 },
    ],
    "PR-015": [
      { date: "2024-10-01", value: 58 },
      { date: "2024-11-01", value: 64 },
      { date: "2024-12-01", value: 70 },
      { date: "2025-01-01", value: 76 },
    ],
  }

  return trendData[metricId] || []
}

export function getMetricStatusColor(status: OutcomeMetric["status"]): string {
  switch (status) {
    case "excellent":
      return "text-green-700 bg-green-50 border-green-200"
    case "good":
      return "text-blue-700 bg-blue-50 border-blue-200"
    case "needs-attention":
      return "text-yellow-700 bg-yellow-50 border-yellow-200"
    case "critical":
      return "text-red-700 bg-red-50 border-red-200"
    default:
      return "text-gray-700 bg-gray-50 border-gray-200"
  }
}

export function getTrendIcon(trend: OutcomeMetric["trend"]): string {
  switch (trend) {
    case "improving":
      return "↗"
    case "declining":
      return "↘"
    case "stable":
      return "→"
    default:
      return "→"
  }
}

export function getTrendColor(trend: OutcomeMetric["trend"]): string {
  switch (trend) {
    case "improving":
      return "text-green-600"
    case "declining":
      return "text-red-600"
    case "stable":
      return "text-gray-600"
    default:
      return "text-gray-600"
  }
}
