import { AllInterventionsAggregatedView } from "@/components/patient-portal/all-interventions-aggregated-view"

export default function PatientInterventionsPage({
  params,
}: {
  params: { patientId: string }
}) {
  return <AllInterventionsAggregatedView patientId={Number(params.patientId)} />
}
