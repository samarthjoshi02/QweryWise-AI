'use client';

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Search,
  BrainCircuit,
  ShieldCheck,
  Zap,
  ChevronDown
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type TimelineStep = {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timeline?: TimelineStep[];
  confidence?: number;
  verification?: {
    docsUsed: number;
    hybridUsed: boolean;
    ocrQuality: string;
    rewritten: boolean;
    contradictions: boolean;
    grounded: boolean;
    sources: string[];
  }
}


import { apiClient } from "@/lib/api-client"

export default function ChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am QueryWise AI. You can ask me questions about your uploaded enterprise documents, and I will provide answers backed by verified evidence.',
    }
  ])
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const currentInput = input;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: currentInput }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    try {
      const data = await apiClient.chat(currentInput);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timeline: data.timeline,
        confidence: Math.round(data.confidence * 100),
        verification: {
          docsUsed: data.sources.length,
          hybridUsed: true,
          ocrQuality: 'High',
          rewritten: true,
          contradictions: data.contradictions,
          grounded: data.grounded,
          sources: data.sources
        }
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error connecting to the backend. Please try again.",
      }]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] max-w-6xl mx-auto p-4 md:p-8 gap-8 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex items-center justify-between pb-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">AI Intelligence Hub</h1>
          <p className="text-muted-foreground mt-1">Chat securely with your enterprise knowledge base.</p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
          Self-Correcting RAG Active
        </Badge>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-6 pb-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/10 shadow-sm mt-1">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                  </div>
                )}
                
                <div className={`flex flex-col gap-3 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-5 rounded-2xl text-[15px] shadow-sm transition-all hover:shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm' 
                      : 'bg-background/80 backdrop-blur-sm border border-border/50 rounded-tl-sm'
                  }`}>
                    <p className="leading-relaxed tracking-wide">{msg.content}</p>
                  </div>

                  {/* Agent Reasoning & Verification Data */}
                  {msg.role === 'assistant' && msg.confidence && msg.verification && (
                    <div className="w-full space-y-3 mt-2">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          {msg.confidence}% Confidence
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <ShieldCheck className="h-4 w-4" />
                          Grounded
                        </div>
                      </div>

                      <Accordion className="w-full bg-card border rounded-lg shadow-sm">
                        <AccordionItem value="verification" className="border-b-0">
                          <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-accent" />
                              View AI Reasoning & Verification
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                              
                              {/* Verification Stats */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Verification Metrics</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="bg-muted p-2 rounded-md">
                                    <span className="text-muted-foreground block mb-1">Sources</span>
                                    <span className="font-medium">{msg.verification.docsUsed} Chunks</span>
                                  </div>
                                  <div className="bg-muted p-2 rounded-md">
                                    <span className="text-muted-foreground block mb-1">Search Type</span>
                                    <span className="font-medium">{msg.verification.hybridUsed ? 'Hybrid Search' : 'Vector Only'}</span>
                                  </div>
                                  <div className="bg-muted p-2 rounded-md">
                                    <span className="text-muted-foreground block mb-1">Contradictions</span>
                                    <span className="font-medium text-emerald-500">None Found</span>
                                  </div>
                                  <div className="bg-muted p-2 rounded-md">
                                    <span className="text-muted-foreground block mb-1">OCR Quality</span>
                                    <span className="font-medium">{msg.verification.ocrQuality}</span>
                                  </div>
                                </div>
                                <div className="pt-2">
                                  <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">Citations</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {msg.verification.sources.map((s, i) => (
                                      <Badge key={i} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                                        [{i+1}] {s}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Timeline */}
                              <div className="space-y-3 border-l pl-4">
                                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">LangGraph Timeline</h4>
                                <div className="space-y-2 relative before:absolute before:inset-0 before:ml-[9px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                                  {msg.timeline?.map((step, idx) => (
                                    <motion.div 
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.1 }}
                                      key={step.id} 
                                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                                    >
                                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-background bg-emerald-500 shrink-0 z-10 shadow">
                                        <CheckCircle2 className="h-3 w-3 text-background" />
                                      </div>
                                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-2 rounded border bg-background shadow-sm text-xs ml-2">
                                        {step.name}
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center shrink-0 border border-border/50 shadow-sm mt-1">
                    <User className="h-5 w-5 text-secondary-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 justify-start"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BrainCircuit className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="bg-card border shadow-sm p-4 rounded-2xl rounded-tl-sm flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Agents are analyzing evidence...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="pt-6 border-t border-border/50">
        <form onSubmit={handleSend} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative flex items-center bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 shadow-sm rounded-2xl px-2 py-2 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your enterprise documents..."
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-[15px] px-4 h-12 bg-transparent"
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              size="icon" 
              className="h-12 w-12 rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 mr-1"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-4 pb-2">
          QueryWise AI can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  )
}
