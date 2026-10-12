import GlobalBackground from "@/components/GlobalBackground";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PhotoStrip from "@/components/PhotoStrip";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Fixed 3D background — sits behind everything */}
      <GlobalBackground />

      <main className="relative z-[20] text-[#e8e8e8] min-h-screen overflow-x-hidden">
        <Navigation />

        {/* Hero — fully transparent so the 3D grid shows through */}
        <Hero />

        <PhotoStrip />
        <Experience />
        <Education />
        {/* <Contact /> */}
        <Footer />
      </main>
    </>
  );
}
