import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/sections/Services';
import WhyUs from '@/components/sections/WhyUs';
import Process from '@/components/sections/Process';
import ServiceArea from '@/components/sections/ServiceArea';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Services />
        <WhyUs />
        <Process />
        <ServiceArea />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
