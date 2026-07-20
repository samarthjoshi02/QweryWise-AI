import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, BrainCircuit, CheckCircle2, Database, ShieldAlert, Sparkles, XCircle } from "lucide-react"

export default function DashboardPage() {
  const agents = [
    { name: "Query Agent", status: "Completed", icon: BrainCircuit, color: "text-primary" },
    { name: "Retrieval Agent", status: "Running", icon: Database, color: "text-blue-500" },
    { name: "Evidence Agent", status: "Idle", icon: ShieldAlert, color: "text-muted-foreground" },
    { name: "Validation Agent", status: "Idle", icon: CheckCircle2, color: "text-muted-foreground" },
    { name: "LLM Agent", status: "Idle", icon: Sparkles, color: "text-muted-foreground" },
    { name: "Evaluation Agent", status: "Failed", icon: XCircle, color: "text-destructive" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
        <p className="text-muted-foreground mt-2">Live monitoring of your multi-agent RAG workflow.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
              <agent.icon className={`h-4 w-4 ${agent.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agent.status}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {agent.status === "Running" ? "Processing current query..." : "Standing by"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Queries</CardTitle>
            <CardDescription>
              Your latest interactions with QueryWise AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              [Activity Chart Placeholder]
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Uptime and latency metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Qdrant DB: Healthy (12ms)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Postgres: Healthy (8ms)</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
