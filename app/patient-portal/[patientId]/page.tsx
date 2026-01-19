import { PatientProgressOverview } from "@/components/patient-portal/patient-progress-overview"

export default function PatientPortalPage({
  params,
}: {
  params: { patientId: string }
}) {
  return <PatientProgressOverview patientId={Number(params.patientId)} />
}
