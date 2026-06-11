import { Suspense } from "react";
import { AdminLoginForm } from "../../components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="afrika-shell flex min-h-screen items-center justify-center px-4 py-10">
          <div className="afrika-panel p-8 text-sm text-white/70">Loading admin sign-in...</div>
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
