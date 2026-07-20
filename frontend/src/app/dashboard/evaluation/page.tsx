import { Activity, Beaker, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EvaluationPage() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Evaluation</h1>
        <p className="text-muted-foreground mt-1">Monitor the performance and accuracy of your RAG pipeline.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Groundedness Score</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Responses supported by evidence</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Self-Corrections</CardTitle>
            <Beaker className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">Contradictions resolved automatically</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-muted/20 border-dashed mt-4">
        <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-medium">Detailed Evaluation Coming Soon</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-2">
          We are building advanced analytics for RAG performance tracking, including hallucination rates and retrieval precision metrics.
        </p>
      </div>
    </div>
  );
}
