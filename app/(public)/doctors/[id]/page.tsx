import { Container } from "@/components/layout/Container";

export default function DoctorDetailsPage() {
  return (
    <Container className="py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Dr. Sarah Ahmed</h1>
        <p className="mt-3 text-slate-600">Cardiology specialist with 12 years of experience in preventive and emergency care.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-900">Education</h2>
            <p className="mt-2 text-sm text-slate-600">Cairo University Hospital • MSc in Cardiology</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-900">Availability</h2>
            <p className="mt-2 text-sm text-slate-600">Mon–Fri • 09:00 – 17:00</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
