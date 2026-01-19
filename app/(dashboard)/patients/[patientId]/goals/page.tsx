import { AllGoalsPhysicianView } from "@/components/physician/all-goals-physician-view"

export default function PatientGoalsPhysicianPage({
  params,
}: {
  params: { patientId: string }
}) {
  return <AllGoalsPhysicianView patientId={Number(params.patientId)} patientName="Sarah Johnson" />
}
