import { DimensionDetail } from "@/components/assessment/dimension-detail"
import { getAssessmentById, getPatientById, getDimensionById } from "@/lib/nsh-assessment-mock"

export default function Page({
  params,
}: {
  params: { patientId: string; date: string; dimensionId: string }
}) {
  const pid = Number.parseInt(params.patientId, 10)
  const decodedDate = decodeURIComponent(params.date)
  const dimensionId = params.dimensionId

  const patient = getPatientById(pid)
  const assessment = getAssessmentById(pid, decodedDate)
  const dimension = assessment ? getDimensionById(assessment, dimensionId) : null

  if (!patient || !assessment || !dimension) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Dimension not found for patient {params.patientId}.
        </p>
      </div>
    )
  }

  return <DimensionDetail patient={patient} assessment={assessment} dimension={dimension} />
}
