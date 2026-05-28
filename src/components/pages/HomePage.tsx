"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Users,
  Award,
  ArrowRight,
  Clock,
  Heart,
  Star,
  Scissors,
  Hand,
  Crown,
  Leaf,
  PenTool,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

// Icon mapping from service icon string to Lucide component
const iconMap: Record<string, LucideIcon> = {
  scissors: Scissors,
  sparkles: Sparkles,
  hand: Hand,
  crown: Crown,
  leaf: Leaf,
  "pen-tool": PenTool,
};

function getServiceIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Sparkles;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HomePage() {
  const services = useAppStore((s) => s.services);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const homePageContent = useAppStore((s) => s.homePageContent);
  const popularServices = services.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 dark:from-rose-950/40 dark:via-pink-950/30 dark:to-rose-900/20" />

        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-300/10 dark:bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-200/20 dark:bg-pink-800/10 rounded-full blur-3xl" />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-[15%] left-[8%] text-primary/20 dark:text-primary/15"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
        </motion.div>
        <motion.div
          className="absolute top-[25%] right-[12%] text-primary/15 dark:text-primary/10"
          animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Heart className="w-7 h-7 sm:w-9 sm:h-9" />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[15%] text-primary/15 dark:text-primary/10"
          animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Star className="w-6 h-6 sm:w-8 sm:h-8" />
        </motion.div>
        <motion.div
          className="absolute bottom-[30%] right-[8%] text-primary/20 dark:text-primary/15"
          animate={{ y: [0, 12, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
        </motion.div>
        <motion.div
          className="absolute top-[60%] left-[5%] text-rose-300/20 dark:text-rose-400/10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          <Crown className="w-6 h-6 sm:w-8 sm:h-8" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mb-4 sm:mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {homePageContent.heroBadge}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-rose-500 to-primary bg-clip-text text-transparent">
              {homePageContent.heroTitle}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-xl sm:text-2xl md:text-3xl font-light text-foreground/80 mb-3 sm:mb-4"
          >
            {homePageContent.heroSubtitle}
          </motion.p>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10"
          >
            {homePageContent.heroDescription}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              onClick={() => setCurrentPage("services")}
            >
              {homePageContent.heroButtonText1}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base px-8 py-6 rounded-full border-primary/30 hover:bg-primary/5 transition-all duration-300"
              onClick={() => setCurrentPage("services")}
            >
              {homePageContent.heroButtonText2}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============ SALON HIGHLIGHTS ============ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-10 sm:mb-14"
          >
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              {homePageContent.whyChooseTitle}{" "}
              <span className="text-primary">{homePageContent.whyChooseBrandName}</span>
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto"
            >
              {homePageContent.whyChooseSubtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
          >
            {/* Years of Experience */}
            <motion.div variants={staggerItem}>
              <Card className="glass rounded-2xl text-center p-6 sm:p-8 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-0">
                <CardHeader className="pb-2">
                  <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Award className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">
                    {homePageContent.stat1Value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold mb-1">{homePageContent.stat1Label}</p>
                  <p className="text-sm text-muted-foreground">
                    {homePageContent.stat1Description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Happy Clients */}
            <motion.div variants={staggerItem}>
              <Card className="glass rounded-2xl text-center p-6 sm:p-8 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-0">
                <CardHeader className="pb-2">
                  <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Users className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">
                    {homePageContent.stat2Value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold mb-1">{homePageContent.stat2Label}</p>
                  <p className="text-sm text-muted-foreground">
                    {homePageContent.stat2Description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Expert Staff */}
            <motion.div variants={staggerItem}>
              <Card className="glass rounded-2xl text-center p-6 sm:p-8 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-0">
                <CardHeader className="pb-2">
                  <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">
                    {homePageContent.stat3Value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold mb-1">{homePageContent.stat3Label}</p>
                  <p className="text-sm text-muted-foreground">
                    {homePageContent.stat3Description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ POPULAR SERVICES ============ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-10 sm:mb-14"
          >
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              {homePageContent.popularServicesTitle} <span className="text-primary">{homePageContent.popularServicesHighlight}</span>
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto"
            >
              {homePageContent.popularServicesSubtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {popularServices.map((service) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <motion.div key={service.id} variants={staggerItem}>
                  <Card className="glass rounded-2xl hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-0 group cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                        {service.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          NPR {service.price}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={0}
            className="text-center mt-10 sm:mt-12"
          >
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 border-primary/30 hover:bg-primary/5 transition-all duration-300"
              onClick={() => setCurrentPage("services")}
            >
              {homePageContent.viewAllServicesButton}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
        {/* Rose gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-rose-500 to-pink-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

        {/* Decorative floating elements */}
        <motion.div
          className="absolute top-10 left-[10%] text-white/10"
          animate={{ y: [0, -15, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-[8%] text-white/10"
          animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Heart className="w-10 h-10" />
        </motion.div>
        <motion.div
          className="absolute top-[40%] right-[15%] text-white/8"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Star className="w-8 h-8" />
        </motion.div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6"
            >
              {homePageContent.ctaTitle}
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-lg sm:text-xl text-white/80 mb-8 sm:mb-10 max-w-xl mx-auto"
            >
              {homePageContent.ctaDescription}
            </motion.p>
            <motion.div variants={staggerItem}>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-7 text-base sm:text-lg font-semibold shadow-xl shadow-black/10 transition-all duration-300 hover:scale-105"
                onClick={() => setCurrentPage("services")}
              >
                {homePageContent.ctaButtonText}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
