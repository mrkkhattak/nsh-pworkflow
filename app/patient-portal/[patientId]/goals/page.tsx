import { AllGoalsAggregatedView } from "@/components/patient-portal/all-goals-aggregated-view"

export default function PatientGoalsPage({
  params,
}: {
  params: { patientId: string }
}) {
  return <AllGoalsAggregatedView patientId={Number(params.patientId)} />
}
