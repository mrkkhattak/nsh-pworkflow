import { AssessmentDetail } from "@/components/assessment/assessment-detail"
import { getAssessmentById, getPatientById } from "@/lib/nsh-assessment-mock"

export default function Page({ params }: { params: { patientId: string; date: string } }) {
  const pid = Number.parseInt(params.patientId, 10)
  const decodedDate = decodeURIComponent(params.date)

  const patient = getPatientById(pid)
  const assessment = getAssessmentById(pid, decodedDate)

  if (!patient || !assessment) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">No assessment found for patient {params.patientId}.</p>
      </div>
    )
  }

  return <AssessmentDetail patient={patient} assessment={assessment} />
}
