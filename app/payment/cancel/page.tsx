export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">❌</div>

        <h1 className="text-3xl font-bold text-red-600">
          Payment Cancelled
        </h1>

        <p className="mt-4 text-slate-600">
          Your payment was cancelled.
        </p>

        <a
          href="/profile"
          className="mt-8 inline-block rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
        >
          Back to My Account
        </a>
      </div>
    </div>
  );
}