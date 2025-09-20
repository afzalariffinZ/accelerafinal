import Image from "next/image";
import PricingSection from "./components/PricingSection";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="font-sans">
      <Navbar />
      <PricingSection />
    </div>
  );
}
