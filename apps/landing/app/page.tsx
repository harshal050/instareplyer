import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero';
import { FeaturesSection } from '@/components/sections/features';
import { HowItWorksSection } from '@/components/sections/how-it-works';
import { PricingSection } from '@/components/sections/pricing';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { FAQSection } from '@/components/sections/faq';
import { CTASection } from '@/components/sections/cta';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
