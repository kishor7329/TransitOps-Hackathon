'use client'

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/AiIntelligence";
import Faq from "@/components/SmartValidationEngine";
import CTA from "@/components/CTA";
import "./globals.css";

export default function Page() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <Faq />
      <CTA />
    </>
  );
}