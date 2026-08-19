import PublicHeader from "@/components/layout/PublicHeader";
import Stepper from "@/components/booking/Stepper";
import { BookingProvider } from "@/lib/booking-context";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <PublicHeader />
      <Stepper />
      {children}
    </BookingProvider>
  );
}
