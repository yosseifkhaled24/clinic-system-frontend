"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { doctorsService } from "@/services/doctors.service";
import { servicesService } from "@/services/services.service";
import type { Doctor } from "@/types/doctor";
import type { ServiceItem } from "@/types/service";

export default function ImageDebugPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorsData, servicesData] = await Promise.all([
          doctorsService.getAll(),
          servicesService.getAll(),
        ]);
        setDoctors(doctorsData);
        setServices(servicesData);
      } catch (err) {
        setError(String(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Container className="py-16">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Image Debug Page</h1>
          <p className="mt-2 text-slate-600">Check image URLs and structure in API responses</p>
        </div>

        {isLoading && <p className="text-sm text-slate-600">Loading...</p>}
        {error && <p className="text-sm text-rose-600">{error}</p>}

        {!isLoading && doctors.length > 0 && (
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Doctors ({doctors.length})</h2>
            <div className="mt-4 space-y-3">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-mono text-slate-900">
                    <span className="font-semibold">Name:</span> {doctor.name}
                  </p>
                  <p className="text-sm font-mono text-slate-700">
                    <span className="font-semibold">ID:</span> {doctor.id}
                  </p>
                  <p className="text-sm font-mono text-slate-700 break-all">
                    <span className="font-semibold">image_url:</span> {doctor.image_url || "(null)"}
                  </p>
                  {doctor.image_url && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-slate-600">URL Test:</p>
                      <iframe
                        src={`${doctor.image_url}?${Date.now()}`}
                        onError={(e) => console.error(`Failed to load: ${doctor.image_url}`, e)}
                        onLoad={() => console.log(`Loaded: ${doctor.image_url}`)}
                        className="mt-1 h-32 w-32 rounded border border-slate-300"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && services.length > 0 && (
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Services ({services.length})</h2>
            <div className="mt-4 space-y-3">
              {services.map((service) => (
                <div key={service.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-mono text-slate-900">
                    <span className="font-semibold">Name:</span> {service.name}
                  </p>
                  <p className="text-sm font-mono text-slate-700 break-all">
                    <span className="font-semibold">image_url:</span> {service.image_url || "(null)"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="font-semibold text-blue-900">Troubleshooting</h3>
          <div className="mt-3 space-y-2 text-sm text-blue-800">
            <p>✓ Check console (F12) for [ApiImage] and [resolveApiImageUrl] logs</p>
            <p>✓ Verify backend is running on <code className="bg-white px-1">http://localhost:8000</code></p>
            <p>✓ Backend must run: <code className="bg-white px-1">php artisan storage:link</code></p>
            <p>✓ Images must be uploaded to doctors/services in backend</p>
            <p>✓ Check browser Network tab for 404/CORS errors on image requests</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
