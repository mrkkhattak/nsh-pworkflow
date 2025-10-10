import { AssessmentDetail } from "@/components/assessment/assessment-detail"
import { getPatientAssessment } from "@/lib/prom-mock"

export default function Page({ params }: { params: { patientId: string; date: string } }) {
  const pid = Number.parseInt(params.patientId, 10)
  const decodedDate = decodeURIComponent(params.date)
  const data = getPatientAssessment(pid, decodedDate)

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">No assessment found for patient {params.patientId}.</p>
      </div>
    )
  }

  return <AssessmentDetail patient={data.patient} assessment={data.assessment} history={data.history} />
}
