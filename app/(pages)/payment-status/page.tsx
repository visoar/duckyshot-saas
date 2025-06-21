import { Suspense } from "react";
import { PaymentStatusContent } from "./_components/payment-status-content";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import { Skeleton } from "@/components/ui/skeleton";

function PaymentStatusSkeleton() {
  return (
    <section className="flex min-h-screen flex-col">
      <div className="bg-background relative grow overflow-hidden">
        <BackgroundPattern />
        <div className="relative px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <div className="bg-background/80 border-border rounded-lg border p-8 text-center shadow-lg backdrop-blur-sm">
              <Skeleton className="mx-auto mb-4 h-16 w-16 rounded-full" />
              <Skeleton className="mx-auto mb-2 h-8 w-64" />
              <Skeleton className="mx-auto mb-6 h-4 w-96" />
              <Skeleton className="mx-auto h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<PaymentStatusSkeleton />}>
      <PaymentStatusContent />
    </Suspense>
  );
}
