import { DimensionDetail } from "@/components/assessment/dimension-detail"
import { getAssessmentById, getPatientById, getDimensionById } from "@/lib/nsh-assessment-mock"

export default async function Page({
  params,
}: {
  params: Promise<{ patientId: string; date: string; dimensionId: string }>
}) {
  const resolvedParams = await params
  const pid = Number.parseInt(resolvedParams.patientId, 10)
  const decodedDate = decodeURIComponent(resolvedParams.date)
  const dimensionId = resolvedParams.dimensionId

  const patient = getPatientById(pid)
  const assessment = getAssessmentById(pid, decodedDate)
  const dimension = assessment ? getDimensionById(assessment, dimensionId) : null

  if (!patient || !assessment || !dimension) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Dimension not found for patient {resolvedParams.patientId}.
        </p>
      </div>
    )
  }

  return <DimensionDetail patient={patient} assessment={assessment} dimension={dimension} />
}
