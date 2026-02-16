'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Section, SectionHeader, FeatureCard } from '@/components/ui/section';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { FEATURES, AUDIENCE } from '@/data';
import { useInView } from '@/hooks';
import { ArrowRight, Coffee, Leaf, Zap, Wifi, Clock, BatteryCharging, Armchair, Briefcase, Laptop, Users, BookOpen, Sun } from 'lucide-react';

import { TextReveal } from '@/components/ui/text-reveal';

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cream-50">
      {/* Background Gradient - Premium Wall Tone - Animate Opacity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-br from-wall via-cream-50 to-accent-sage/20 hidden lg:block"
      />

      {/* Decorative Elements - Sage & Olive Accents - Floating Animation */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-96 h-96 bg-olive-200/10 rounded-full blur-[100px] hidden lg:block"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent-sage/20 rounded-full blur-[120px] hidden lg:block"
      />

      {/* Grid Pattern - Subtle Texture */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(#546032 1px, transparent 1px), linear-gradient(to right, #546032 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Mobile Background Image - Premium Design */}
      <div className="absolute inset-0 lg:hidden animate-fade-in">
        <OptimizedImage
          src="/images/shop-interior.jpg"
          alt="Thinkery Café Ambiance"
          fill
          className="object-cover"
          priority
        />
        {/* Advanced Gradient Overlay for Maximum Readability & Mood */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60" />

        {/* Top Gradient for Nav Visibility */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />

        {/* Premium Curved Bottom - Matching Next Section */}
        <div className="absolute -bottom-1 left-0 right-0 h-16 bg-cream-50 rounded-t-[3rem] z-20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text Content */}
          <div className="max-w-xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pl-2 pr-4 py-1.5 mb-8 lg:bg-olive-100/50 lg:border-olive-200 lg:backdrop-blur-sm shadow-xl shadow-black/5"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cream-200 lg:bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cream-100 lg:bg-gold-500"></span>
              </span>
              <span className="text-white text-[10px] md:text-xs font-medium tracking-[0.15em] uppercase lg:text-olive-800">
                Now Open in Calicut
              </span>
            </motion.div>

            {/* Headline */}
            <TextReveal as="h1" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-cream-50 lg:text-olive-900 leading-[1.05] mb-6 drop-shadow-lg lg:drop-shadow-none">
              A Calm Café
              <br />
              Space in Calicut
              <span className="block text-cream-200 lg:text-olive-500 text-2xl sm:text-3xl md:text-4xl mt-4 font-normal italic font-serif">
                Where Minds Meet.
              </span>
            </TextReveal>

            {/* Subtext */}
            <TextReveal as="p" delay={0.2} className="text-cream-100/90 lg:text-warm-600 text-lg md:text-xl leading-relaxed mb-10 max-w-lg font-medium lg:font-normal drop-shadow-sm lg:drop-shadow-none">
              A thoughtfully designed café for work, meetings, and meaningful conversations.
            </TextReveal>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-cream-50 text-olive-900 hover:bg-white lg:bg-olive-700 lg:hover:bg-olive-800 lg:text-white rounded-full px-8 py-6 text-base shadow-xl lg:shadow-olive-700/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
              >
                <Link href="/contact">
                  Visit Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-base border-white text-white bg-white/5 hover:bg-white/20 lg:border-olive-300 lg:text-olive-700 lg:bg-transparent lg:hover:bg-olive-50 lg:hover:border-olive-400 transition-all duration-300 backdrop-blur-sm"
              >
                <Link href="/menu">View Menu</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 md:gap-8 mt-12"
            >
              <div>
                <p className="text-2xl md:text-3xl font-serif font-medium text-cream-50 lg:text-olive-800">50+</p>
                <p className="text-cream-200/80 lg:text-olive-600/70 text-[10px] md:text-xs uppercase tracking-widest mt-1">Menu Items</p>
              </div>
              <div className="w-px h-10 bg-white/20 lg:bg-olive-200" />
              <div>
                <p className="text-2xl md:text-3xl font-serif font-medium text-cream-50 lg:text-olive-800">100%</p>
                <p className="text-cream-200/80 lg:text-olive-600/70 text-[10px] md:text-xs uppercase tracking-widest mt-1">WiFi Uptime</p>
              </div>
              <div className="w-px h-10 bg-white/20 lg:bg-olive-200" />
              <div>
                <p className="text-2xl md:text-3xl font-serif font-medium text-cream-50 lg:text-olive-800">7</p>
                <p className="text-cream-200/80 lg:text-olive-600/70 text-[10px] md:text-xs uppercase tracking-widest mt-1">Days Open</p>
              </div>
            </motion.div>
          </div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} // Premium custom bezier
            className="relative hidden lg:block"
          >
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-olive-900/10 aspect-[4/5] lg:aspect-[3/4]">
              <OptimizedImage
                src="/images/shop-interior.jpg"
                alt="Thinkery Café interior - sophisticated olive and cream design with brass accents"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-[1.5s]"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-olive-900/30 via-transparent to-transparent" />

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/90 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-500/20">
                    <Coffee className="w-5 h-5 text-cream-50" />
                  </div>
                  <div>
                    <p className="text-olive-900 font-medium text-sm">Premium Coffee & More</p>
                    <p className="text-olive-600 text-xs">Signature teas, fresh juices, comfort food</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-olive-200 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-olive-100/50 rounded-2xl -z-10" />

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 1, type: "spring" }}
              className="absolute -top-3 -left-3 bg-cream-50 rounded-2xl shadow-lg p-3"
            >
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-olive-600" />
                <span className="text-olive-800 text-xs font-medium">Minimal & Green</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade - Desktop Only */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-50 to-transparent hidden lg:block" />
    </section >
  );
}

function AboutSection() {
  const { ref, isInView } = useInView();

  return (
    <Section id="about" className="py-24 md:py-32 relative overflow-hidden bg-cream-50">
      <div ref={ref} className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto px-4">

        {/* Left Side: Premium Image Composition */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative group"
        >
          {/* Main Image Base - Tall & Elegant */}
          <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] md:aspect-[4/5] shadow-2xl shadow-olive-900/20">
            <OptimizedImage
              src="/images/cafe-interior-2.jpg" // Using existing image
              alt="Thinkery Café - comfortable seating area with olive green furniture in Calicut"
              fill
              className="object-cover scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Gradient Overlay for Text Contrast later if needed, or just mood */}
            <div className="absolute inset-0 bg-gradient-to-t from-olive-900/40 to-transparent opacity-60" />
          </div>

          {/* Floating Detail Card - "Vignette" with Meaning */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute -bottom-6 -right-4 md:-bottom-10 md:-right-12 w-48 md:w-64 aspect-square bg-cream-50 rounded-3xl p-3 shadow-2xl shadow-olive-900/10 z-20"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-olive-100 group">
              <OptimizedImage
                src="/images/shop-interior.jpg"
                alt="Calm corner for reading"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Glass Overlay on Image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

              {/* Text Content inside the card */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[10px] uppercase tracking-widest font-medium opacity-80 mb-1">Ambiance</p>
                <p className="font-serif text-lg leading-tight">Designed for <br />Mindfulness</p>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-olive-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <Leaf className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Decor: Abstract Lines behind */}
          <motion.div
            initial={{ opacity: 0, rotate: -45 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute -top-12 -left-12 w-64 h-64 border border-olive-200/40 rounded-full -z-10"
          />
          <div className="absolute -bottom-12 -left-4 w-32 h-32 bg-olive-50 rounded-full blur-2xl -z-10" />
        </motion.div>

        {/* Right Side: Editorial Text */}
        <div className="relative">

          <div className="inline-flex items-center gap-2 mb-8">
            <span className="w-8 h-px bg-olive-300"></span>
            <span className="text-olive-500 font-medium tracking-[0.2em] text-xs uppercase">Since 2026</span>
          </div>

          <TextReveal as="h2" className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-olive-900 leading-[1.15] mb-6 md:mb-8">
            More than just <br />
            <span className="italic text-olive-600 relative inline-block">
              coffee.
              {/* Organic underline */}
              <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-gold-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </TextReveal>

          <div className="space-y-6 text-lg text-olive-800/80 font-light leading-relaxed mb-10">
            <TextReveal as="p" delay={0.1}>
              Thinkery is a modern café in Calicut built for <strong className="font-medium text-olive-900">thinkers, creators, professionals,</strong> and anyone seeking a peaceful environment.
            </TextReveal>
            <TextReveal as="p" delay={0.2}>
              More than just coffee and snacks, we offer a <span className="italic text-olive-700">calm space</span> for small meetings, focused work, and quality time.
            </TextReveal>
            <TextReveal as="p" delay={0.3}>
              Whether you're a startup founder, remote employee, student, or simply looking for a quiet break — <strong className="font-medium text-olive-900">Thinkery welcomes you.</strong>
            </TextReveal>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Button
              asChild
              size="lg"
              className="bg-olive-800 text-cream-50 rounded-full px-8 py-7 text-base hover:bg-olive-900 transition-all duration-300 shadow-xl shadow-olive-900/10 hover:shadow-2xl hover:-translate-y-1 group"
            >
              <Link href="/about">
                Our Story
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {/* Placeholder Avatars for social proof feel */}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-olive-100 flex items-center justify-center text-xs font-bold text-olive-700">T</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-warm-100 flex items-center justify-center text-xs font-bold text-warm-700">C</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-olive-200 flex items-center justify-center text-xs font-bold text-olive-800">M</div>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-olive-900">Community</p>
                <p className="text-olive-600/70 text-xs">Join our calm space</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
}

function DifferenceSection() {
  const { ref, isInView } = useInView();

  return (
    <Section className="py-32 relative overflow-hidden bg-cream-100">
      {/* Premium Fluted Texture Background */}
      <div className="absolute inset-0 bg-fluted opacity-30 pointer-events-none" />

      {/* Premium Gradient Background Blur */}
      <motion.div
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-olive-50/50 to-transparent -z-10"
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header - Centered & elegant */}
        <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto px-4">
          <TextReveal as="span" className="text-olive-600 font-medium tracking-[0.2em] text-[10px] md:text-xs uppercase mb-4 block">The Thinkery Standard</TextReveal>
          <TextReveal as="h2" delay={0.1} className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-olive-900 tracking-tight mb-6 leading-[1.1]">
            Not a noisy hangout. <br className="hidden md:block" />
            <span className="italic text-olive-500 font-normal">A place for clarity.</span>
          </TextReveal>
          <TextReveal delay={0.2} className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-8 text-lg font-light text-olive-800/80">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive-500" />
              <span>Quiet Environment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive-500" />
              <span>Focus-Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive-500" />
              <span>Minimal Design</span>
            </div>
          </TextReveal>
        </div>

        {/* Premium BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[minmax(180px,auto)]">

          {/* 1. MAIN CARD: QUIET (Span 7) */}
          <TextReveal as="div" delay={0.2} className="md:col-span-7 md:row-span-2 rounded-[2rem] md:rounded-[2.5rem] bg-[#2C3318] text-cream-50 p-8 md:p-14 flex flex-col justify-between relative overflow-hidden group hover:ring-1 hover:ring-inset hover:ring-white/10 shadow-2xl shadow-olive-900/10">
            <div className="relative z-20">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-8 md:mb-10 shadow-2xl">
                <span className="text-2xl md:text-3xl">🤫</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-serif font-medium mb-6 leading-tight">Quiet by<br />Design.</h3>
              <div className="space-y-4 max-w-md">
                <p className="text-olive-100/80 text-lg font-light leading-relaxed">
                  Acoustically treated interiors and a culture of respect.
                </p>
                <div className="flex items-center gap-3 text-sm font-medium text-olive-300">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">No loud music</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Sound absorbing</span>
                </div>
              </div>
            </div>
            {/* Abstract Noise visual */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-l from-[#2C3318] to-transparent z-10" />
              {/* Using repeating gradient to simulate sound waves */}
              <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_11px)]" />
            </div>
          </TextReveal>

          {/* 2. GREENERY (Span 5) */}
          <TextReveal as="div" delay={0.3} className="md:col-span-5 md:row-span-1 rounded-[2.5rem] bg-[#E6E8D8] p-10 relative overflow-hidden group shadow-xl shadow-olive-900/5">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-serif font-medium text-olive-900">Biophilic<br />Interiors</h3>
                <Leaf className="w-8 h-8 text-olive-700" />
              </div>
              <p className="text-olive-800/70 mt-4 font-light">Living plants and natural light to reduce stress and boost creativity.</p>
            </div>
            <div className="absolute -bottom-10 -right-10 text-olive-600/10 rotate-12 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
              <Leaf className="w-48 h-48" />
            </div>
          </TextReveal>

          {/* 3. WIFI (Span 5) */}
          <TextReveal as="div" delay={0.4} className="md:col-span-5 md:row-span-1 rounded-[2.5rem] bg-white border border-olive-100 p-8 flex items-center justify-between group hover:shadow-2xl hover:shadow-olive-900/5 transition-shadow duration-500">
            <div>
              <h3 className="text-xl font-serif font-medium text-olive-900 mb-1">Gigabit WiFi</h3>
              <p className="text-olive-600/60 text-sm">Fiber-optic speed.</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-olive-50 flex items-center justify-center group-hover:bg-olive-900 group-hover:text-white transition-all duration-300">
              <Wifi className="w-6 h-6" />
            </div>
          </TextReveal>

          {/* 4. COMFORT (Span 12) */}
          <TextReveal as="div" delay={0.5} className="md:col-span-12 rounded-[2.5rem] bg-white border border-olive-100 p-10 md:p-14 flex flex-col md:flex-row items-center gap-12 group hover:shadow-2xl hover:shadow-olive-900/5 transition-shadow duration-500">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-olive-200" />
                <span className="text-olive-500 text-xs font-bold uppercase tracking-widest">Workspace Ready</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-medium text-olive-900 mb-6">Ergonomics meets Aesthetic.</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <h4 className="font-medium text-olive-900 flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-olive-500" /> Premium Seating
                  </h4>
                  <p className="text-sm text-olive-600/70">Designed for long hours.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-olive-900 flex items-center gap-2">
                    <BatteryCharging className="w-4 h-4 text-olive-500" /> Power Everywhere
                  </h4>
                  <p className="text-sm text-olive-600/70">Sockets at every table.</p>
                </div>
              </div>
            </div>

            {/* Visual Representation of Comfort/Time */}
            <div className="w-full md:w-1/3 bg-warm-50/50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-warm-100/50 relative overflow-hidden mt-8 md:mt-0">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Clock className="w-20 h-20 md:w-24 md:h-24 text-olive-900" />
              </div>
              <div className="relative z-10">
                <p className="text-5xl md:text-6xl font-serif font-medium text-olive-900 mb-2">4hr+</p>
                <p className="text-olive-600 font-medium text-sm md:text-base">Average Stay Time</p>
                <p className="text-xs text-olive-500/60 mt-2">We encourage longer,<br />relaxed stays.</p>
              </div>
            </div>
          </TextReveal>
        </div>
      </div>
    </Section>
  );
}

function OfferingsSection() {
  const { ref, isInView } = useInView();

  return (
    <Section className="py-32 relative overflow-hidden bg-cream-50">
      {/* Texture & Ambient Light */}
      <div className="absolute inset-0 bg-fluted opacity-20 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }} />
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-olive-100/30 blur-[120px] rounded-full pointer-events-none"
      />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <TextReveal as="span" className="text-olive-600/80 font-medium tracking-[0.3em] text-xs uppercase mb-6 block">Savor the Moment</TextReveal>
          <TextReveal as="h2" delay={0.1} className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-olive-900 leading-tight mb-6 relative inline-block">
            Simple. Fresh.<br />
            <span className="italic text-olive-500">Comforting.</span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-8 text-4xl"
            >✨</motion.span>
          </TextReveal>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-olive-300 to-transparent mx-auto mt-8" />
        </div>

        {/* Premium Menu Cards Layout - Asymmetrical Grid */}
        <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">

          {/* 1. BEVERAGES CARD (Span 7) */}
          <TextReveal as="div" delay={0.2} className="md:col-span-7 group relative bg-white border border-cream-100 p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-olive-900/5 transition-transform duration-500 hover:-translate-y-2 hover:shadow-olive-900/10">
            {/* Decorative Number */}
            <span className="absolute top-6 right-6 md:top-10 md:right-10 text-6xl md:text-8xl lg:text-9xl font-serif text-olive-900/10 select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">01</span>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-10 md:mb-14">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-olive-900 text-cream-50 flex items-center justify-center shadow-lg shadow-olive-900/20">
                  <Coffee className="w-7 h-7 md:w-9 md:h-9" />
                </div>
                <div>
                  <span className="text-olive-500 font-medium tracking-widest text-xs uppercase mb-2 block">The Brew Bar</span>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-olive-900 leading-none">Liquid Inspiration</h3>
                </div>
              </div>

              {/* Menu Items - Clean Minimal List */}
              <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                <div className="space-y-1 group/item cursor-pointer">
                  <div className="flex justify-between items-baseline border-b border-olive-100 pb-2 transition-colors group-hover/item:border-olive-400">
                    <span className="font-medium text-lg text-olive-900">Signature Tea</span>
                    <span className="text-olive-500 font-serif">₹120</span>
                  </div>
                  <p className="text-xs text-olive-400 uppercase tracking-widest">Loose Leaf • Blends</p>
                </div>

                <div className="space-y-1 group/item cursor-pointer">
                  <div className="flex justify-between items-baseline border-b border-olive-100 pb-2 transition-colors group-hover/item:border-olive-400">
                    <span className="font-medium text-lg text-olive-900">Premium Coffee</span>
                    <span className="text-olive-500 font-serif">₹140</span>
                  </div>
                  <p className="text-xs text-olive-400 uppercase tracking-widest">Espresso • Pour-over</p>
                </div>
                <div className="space-y-1 group/item cursor-pointer">
                  <div className="flex justify-between items-baseline border-b border-olive-100 pb-2 transition-colors group-hover/item:border-olive-400">
                    <span className="font-medium text-lg text-olive-900">Fresh Juices</span>
                    <span className="text-olive-500 font-serif">₹160</span>
                  </div>
                  <p className="text-xs text-olive-400 uppercase tracking-widest">No Sugar • Cold Pressed</p>
                </div>
                <div className="space-y-1 group/item cursor-pointer">
                  <div className="flex justify-between items-baseline border-b border-olive-100 pb-2 transition-colors group-hover/item:border-olive-400">
                    <span className="font-medium text-lg text-olive-900">Milkshakes</span>
                    <span className="text-olive-500 font-serif">₹180</span>
                  </div>
                  <p className="text-xs text-olive-400 uppercase tracking-widest">Thick • Creamy</p>
                </div>
                <div className="space-y-1 group/item cursor-pointer">
                  <div className="flex justify-between items-baseline border-b border-olive-100 pb-2 transition-colors group-hover/item:border-olive-400">
                    <span className="font-medium text-lg text-olive-900">Iced Drinks</span>
                    <span className="text-olive-500 font-serif">₹150</span>
                  </div>
                  <p className="text-xs text-olive-400 uppercase tracking-widest">Summer Refreshers</p>
                </div>
              </div>
            </div>
          </TextReveal>

          {/* 2. FOOD CARD (Span 5) - Dark Mode Contrast */}
          <TextReveal as="div" delay={0.3} className="md:col-span-5 group relative bg-olive-950 overflow-hidden p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-olive-900/10 transition-transform duration-500 hover:-translate-y-2">
            {/* Gradient Depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-olive-800/20 to-transparent pointer-events-none" />

            {/* Decorative Number */}
            <span className="absolute top-6 right-6 md:top-10 md:right-10 text-6xl md:text-8xl lg:text-9xl font-serif text-white/5 select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12">02</span>

            <div className="relative z-10">
              <div className="flex flex-col gap-6 mb-10 md:mb-14">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-olive-800/50 text-cream-50 border border-olive-700 flex items-center justify-center shadow-lg shadow-black/20">
                  <Zap className="w-7 h-7 md:w-9 md:h-9" />
                </div>
                <div>
                  <span className="text-olive-400/80 font-medium tracking-widest text-xs uppercase mb-2 block">The Kitchen</span>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-cream-50 leading-none">Nourishment</h3>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-1 group/item cursor-pointer">
                  <div className="flex justify-between items-baseline border-b border-olive-700 pb-2 transition-colors group-hover/item:border-cream-50">
                    <span className="font-medium text-lg text-cream-50">Gourmet Wraps</span>
                    <span className="text-olive-300 font-serif">₹190</span>
                  </div>
                  <p className="text-xs text-olive-400 uppercase tracking-widest">Freshly Grilled • Chicken / Paneer</p>
                </div>

                <div className="space-y-1 group/item cursor-pointer">
                  <div className="flex justify-between items-baseline border-b border-olive-700 pb-2 transition-colors group-hover/item:border-cream-50">
                    <span className="font-medium text-lg text-cream-50">Burgers</span>
                    <span className="text-olive-300 font-serif">₹220</span>
                  </div>
                  <p className="text-xs text-olive-400 uppercase tracking-widest">Juicy Patty • Classic / Veg</p>
                </div>

                <div className="space-y-1 group/item cursor-pointer">
                  <div className="flex justify-between items-baseline border-b border-olive-700 pb-2 transition-colors group-hover/item:border-cream-50">
                    <span className="font-medium text-lg text-cream-50">Loaded Fries</span>
                    <span className="text-olive-300 font-serif">₹180</span>
                  </div>
                  <p className="text-xs text-olive-400 uppercase tracking-widest">Seasoned • Cheese / Sauces</p>
                </div>

                <div className="space-y-1 group/item cursor-pointer">
                  <div className="flex justify-between items-baseline border-b border-olive-700 pb-2 transition-colors group-hover/item:border-cream-50">
                    <span className="font-medium text-lg text-cream-50">Cutlets & Snacks</span>
                    <span className="text-olive-300 font-serif">₹90</span>
                  </div>
                  <p className="text-xs text-olive-400 uppercase tracking-widest">Crispy • Light Bites</p>
                </div>
              </div>
            </div>
          </TextReveal>

        </div>

        {/* Bottom CTA / Note */}
        <div className={`text-center mt-16 md:mt-24 transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-olive-500 font-serif italic text-xl md:text-2xl mb-8">"Fuel for your best ideas."</p>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 py-6 border-olive-200 text-olive-800 hover:bg-olive-50 hover:text-olive-900 transition-all duration-300"
          >
            <Link href="/menu">Explore Full Menu</Link>
          </Button>
        </div>

      </div>
    </Section>
  );
}

function AudienceSection() {
  const { ref, isInView } = useInView();

  const audience = [
    {
      icon: Briefcase,
      title: 'Corporate Professionals',
      description: 'A quiet alternative to office cafeterias for meetings and focused work.',
    },
    {
      icon: Laptop,
      title: 'Remote Workers',
      description: 'Reliable WiFi, power outlets, and a calm ambiance — your ideal remote office.',
    },
    {
      icon: Users,
      title: 'Small Business Meetings',
      description: 'An informal yet professional setting for productive discussions.',
    },
    {
      icon: BookOpen,
      title: 'Students & Planners',
      description: 'A focused space for studying, planning, and creative work.',
    },
    {
      icon: Sun,
      title: 'Individuals Seeking Calm',
      description: 'Step away from the noise. Find your moment of peace over a cup of coffee.',
    },
  ];

  return (
    <Section className="bg-olive-900 text-cream-50 py-32 rounded-t-[4rem] -mt-12 relative z-10 overflow-hidden">
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 bg-fluted opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />

      {/* Atmospheric Glow - Warm Cream/Gold Hint */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-olive-800/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cream-900/5 blur-[100px] rounded-full pointer-events-none"
      />

      <div ref={ref} className="max-w-[90rem] mx-auto px-6 relative z-10">

        {/* Header - Editorial Style */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-12 bg-cream-500/50"></span>
              <TextReveal as="span" className="text-cream-200/80 font-medium tracking-[0.25em] text-xs uppercase">Curated Audience</TextReveal>
            </div>
            <TextReveal as="h2" delay={0.1} className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-cream-50 leading-[0.9] tracking-tight">
              A Space for <br />
              <span className="italic text-cream-200">Deep Work.</span>
            </TextReveal>
          </div>

          <TextReveal as="p" delay={0.3} className="text-olive-200/60 text-lg md:text-xl font-light max-w-md leading-relaxed md:text-right border-l md:border-l-0 md:border-r border-olive-800 pl-6 md:pl-0 md:pr-6">
            Whether you're here to focus, collaborate, or simply exhale — we've designed this environment for you.
          </TextReveal>
        </div>

        {/* Premium BENTO Grid Layout */}
        <div className="grid md:grid-cols-12 gap-6">

          {/* 1. Corporate (Large Card) - Span 7 */}
          <TextReveal as="div" delay={0.2} className="md:col-span-7 group relative bg-white/[0.05] backdrop-blur-md border border-white/10 p-10 md:p-14 rounded-[3rem] overflow-hidden hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 shadow-2xl shadow-black/20">
            <div className="absolute right-0 top-0 w-64 h-64 bg-cream-500/5 blur-[80px] rounded-full group-hover:bg-cream-500/10 transition-colors duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
              <div className="w-20 h-20 rounded-full bg-olive-800/80 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Briefcase className="w-8 h-8 text-cream-100" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-serif text-cream-50 mb-3">Corporate Professionals</h3>
                <p className="text-cream-100/70 text-lg font-light">A quiet, dignified alternative to office cafeterias.</p>
              </div>
            </div>
          </TextReveal>

          {/* 2. Remote (Tall Card) - Span 5 */}
          <TextReveal as="div" delay={0.3} className="md:col-span-5 group relative bg-gradient-to-br from-olive-800/30 to-olive-900/30 backdrop-blur-md border border-white/10 p-10 md:p-14 rounded-[3rem] overflow-hidden hover:border-cream-500/30 transition-all duration-500 shadow-2xl shadow-black/20">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 rounded-full bg-olive-500/20 border border-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <Laptop className="w-7 h-7 text-olive-100" strokeWidth={1.5} />
                </div>
                <span className="px-4 py-1 rounded-full border border-olive-500/30 text-olive-300 text-xs uppercase tracking-widest bg-olive-900/40">WiFi 6E</span>
              </div>
              <h3 className="text-3xl font-serif text-cream-50 mb-3">Remote Workers</h3>
              <p className="text-olive-200/70 font-light">Your ideal remote office with reliable power & ambiance.</p>
            </div>
          </TextReveal>

          {/* 3. Small Business (Medium Card) - Span 4 */}
          <TextReveal as="div" delay={0.4} className="md:col-span-4 group relative bg-white/[0.03] backdrop-blur-sm border border-white/5 p-10 rounded-[3rem] overflow-hidden hover:bg-white/[0.05] transition-colors duration-500">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-full bg-olive-900/50 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Users className="w-6 h-6 text-olive-100" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif text-cream-50 mb-3">Founders & Teams</h3>
              <p className="text-olive-200/70 font-light">Informal yet professional.</p>
            </div>
          </TextReveal>

          {/* 4. Students (Medium Card) - Span 4 */}
          <TextReveal as="div" delay={0.45} className="md:col-span-4 group relative bg-white/[0.03] backdrop-blur-sm border border-white/5 p-10 rounded-[3rem] overflow-hidden hover:bg-white/[0.05] transition-colors duration-500">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-full bg-olive-900/50 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="w-6 h-6 text-olive-100" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif text-cream-50 mb-3">Deep Focus</h3>
              <p className="text-olive-200/70 font-light">For studying and planning.</p>
            </div>
          </TextReveal>

          {/* 5. Seekers of Calm (Medium Card) - Span 4 */}
          <TextReveal as="div" delay={0.5} className="md:col-span-4 group relative bg-gradient-to-br from-olive-800/40 to-olive-900/40 backdrop-blur-sm border border-white/5 p-10 rounded-[3rem] overflow-hidden hover:from-olive-800/50 hover:to-olive-900/50 transition-colors duration-500">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Sun className="w-6 h-6 text-cream-50" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif text-cream-50 mb-3">Seekers of Calm</h3>
              <p className="text-olive-200/70 font-light">Find your moment of peace.</p>
            </div>
          </TextReveal>

        </div>

      </div>
    </Section>
  );
}

function GallerySection() {
  const { ref, isInView } = useInView();

  return (
    <Section className="py-0 relative bg-cream-50 overflow-hidden">
      {/* Ambient Noise Texture */}
      <div className="absolute inset-0 bg-fluted opacity-20 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Full Width Container */}
      <div ref={ref} className="relative w-full">

        {/* Editorial Header */}
        <div className="relative z-20 max-w-[90rem] mx-auto px-6 pt-24 pb-12 md:pt-32 md:pb-20 grid md:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="md:col-span-7">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-8 bg-olive-400"></span>
              <TextReveal as="span" className="text-olive-600 font-medium tracking-[0.2em] text-xs uppercase">The Interiors</TextReveal>
            </div>
            <TextReveal as="h2" delay={0.1} className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-olive-900 leading-[0.9] tracking-tight">
              Designed for <br />
              <span className="italic text-olive-500 ml-4 md:ml-12">Clarity.</span>
            </TextReveal>
          </div>
          <div className="md:col-span-5 md:pb-4">
            <TextReveal as="p" delay={0.3} className="text-lg md:text-xl text-olive-800/80 font-light leading-relaxed max-w-md ml-auto border-l border-olive-200 pl-6">
              A peek into our minimal, green-inspired interiors — thoughtfully crafted for calm, comfort, and conversation.
            </TextReveal>
          </div>
        </div>

        {/* Mosaic Image Grid - Varied Heights & Widths */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 w-full px-4 md:px-0 pb-20">

          {/* 1. Tall Feature (Entrance) - Spans 4 cols, 2 rows height */}
          <TextReveal as="div" delay={0.2} className="md:col-span-4 md:row-span-2 relative h-[50vh] md:h-auto min-h-[500px] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-olive-900/20">
            <OptimizedImage
              src="/images/gallery-4.jpg"
              alt="Minimal archway entrance"
              fill
              className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity duration-700" />

            {/* Floating Caption */}
            <div className="absolute top-8 left-8 z-20">
              <span className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase border border-white/30 bg-white/10 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg">
                The Entrance
              </span>
            </div>
          </TextReveal>

          {/* 2. Wide Feature (Lounge) - Spans 8 cols */}
          <TextReveal as="div" delay={0.3} className="md:col-span-8 relative h-[35vh] md:h-[45vh] min-h-[300px] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-olive-900/20">
            <OptimizedImage
              src="/images/gallery-1.jpg"
              alt="Green inspired minimal interior seating"
              fill
              className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />

            <div className="absolute bottom-8 left-8 z-20">
              <span className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase border border-white/30 bg-white/10 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg">
                Main Lounge
              </span>
            </div>
          </TextReveal>

          {/* 3. Medium (Counter/Detail) - Spans 4 cols */}
          <TextReveal as="div" delay={0.4} className="md:col-span-4 relative h-[30vh] md:h-[40vh] min-h-[250px] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-olive-900/20">
            <OptimizedImage
              src="/images/gallery-2.jpg"
              alt="Coffee bar details"
              fill
              className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
            <div className="absolute bottom-8 left-8 z-20">
              <span className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase border border-white/30 bg-white/10 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg">
                The Bar
              </span>
            </div>
          </TextReveal>

          {/* 4. Medium (Workspace) - Spans 4 cols */}
          <TextReveal as="div" delay={0.5} className="md:col-span-4 relative h-[30vh] md:h-[40vh] min-h-[250px] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-olive-900/20">
            <OptimizedImage
              src="/images/gallery-3.jpg"
              alt="Workspace area"
              fill
              className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
            <div className="absolute bottom-8 left-8 z-20">
              <span className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase border border-white/30 bg-white/10 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg">
                Workspace
              </span>
            </div>
          </TextReveal>
        </div>

      </div>
    </Section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <DifferenceSection />
      <OfferingsSection />
      <GallerySection />
      <AudienceSection />
    </>
  );
}
