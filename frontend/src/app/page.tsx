'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Zap, Database, BrainCircuit, Search } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Gradient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">QueryWise AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/api/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-24 pb-32">
        {/* Hero Section */}
        <motion.div 
          className="text-center max-w-4xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground"
            variants={itemVariants}
          >
            Enterprise AI That <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Never Guesses.</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Upload documents, ask questions, and receive trustworthy answers backed by real evidence, confidence scores, and intelligent self-correction.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            variants={itemVariants}
          >
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto gap-2 rounded-full px-8">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8">
              View Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Why QueryWise AI?</h2>
            <p className="text-muted-foreground mt-4">Built for enterprises that demand accuracy and transparency.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-primary" />}
              title="Self-Correcting RAG"
              description="Our agents detect contradictions and groundedness, retrying searches if confidence is low."
            />
            <FeatureCard 
              icon={<Search className="h-8 w-8 text-accent" />}
              title="Verifiable Evidence"
              description="Every answer includes a clickable citation linking directly to the exact paragraph in your document."
            />
            <FeatureCard 
              icon={<Database className="h-8 w-8 text-secondary-foreground" />}
              title="Any Enterprise Format"
              description="Seamlessly handles messy PDFs, DOCX, TXT, and scanned documents with advanced OCR."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">QueryWise AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ by QueryWise AI Engineering Team.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
    >
      <div className="mb-4 bg-background w-16 h-16 rounded-full flex items-center justify-center border shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
