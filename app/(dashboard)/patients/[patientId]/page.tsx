import { PatientDetailView } from "@/components/patient-detail-view"

export default function PatientDetailPage({
  params,
}: {
  params: { patientId: string }
}) {
  return <PatientDetailView />
}
