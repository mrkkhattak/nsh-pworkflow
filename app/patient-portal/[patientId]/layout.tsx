import { PatientPortalLayout } from "@/components/patient-portal/patient-portal-layout"

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { patientId: string }
}) {
  return <PatientPortalLayout patientId={params.patientId}>{children}</PatientPortalLayout>
}
