import { HelpCircle, Book, MessageCircle, FileQuestion } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Help & Documentation</h1>
        <p className="text-muted-foreground mt-1">Learn how to use QueryWise AI and get support.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
          <CardHeader>
            <Book className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <CardTitle>Getting Started Guide</CardTitle>
            <CardDescription>Learn how to upload documents and start chatting with your enterprise data.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
          <CardHeader>
            <FileQuestion className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <CardTitle>FAQ</CardTitle>
            <CardDescription>Answers to common questions about embeddings, context windows, and pricing.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors cursor-pointer group md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Need help with a custom integration? Our team is here to assist.</CardDescription>
            </div>
            <div className="ml-auto">
              <Button>Open Ticket</Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
