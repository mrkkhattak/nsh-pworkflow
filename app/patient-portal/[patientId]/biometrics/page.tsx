import { BiometricsDashboard } from "@/components/patient-portal/biometrics-dashboard"

export default function BiometricsPage({
  params,
}: {
  params: { patientId: string }
}) {
  return <BiometricsDashboard patientId={Number(params.patientId)} />
}
