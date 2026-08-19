export const dynamic = "force-dynamic";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import HowItWorks from "@/components/home/HowItWorks";
import Ticker from "@/components/home/Ticker";
import PackageList from "@/components/home/PackageList";
import FinalCta from "@/components/home/FinalCta";
import { getActivePackages } from "@/server/catalog";

export default async function HomePage() {
  const packages = await getActivePackages();

  return (
    <>
      <PublicHeader />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <Ticker />
        <PackageList packages={packages} />
        <FinalCta />
      </main>
      <PublicFooter />
    </>
  );
}
