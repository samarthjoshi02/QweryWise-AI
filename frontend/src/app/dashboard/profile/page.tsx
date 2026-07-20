'use client';

import { useSession } from "next-auth/react";
import { User, Activity, FileText, MessageSquare, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentHistory = [
  { id: 1, query: "What was our Q3 revenue growth?", date: "2 hours ago", status: "Success", confidence: 96 },
  { id: 2, query: "Summarize the engineering guidelines.", date: "5 hours ago", status: "Success", confidence: 98 },
  { id: 3, query: "Who is the CEO?", date: "Yesterday", status: "Low Confidence", confidence: 45 },
  { id: 4, query: "Show me the new AI architecture.", date: "2 days ago", status: "Success", confidence: 92 },
];

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-6 p-6 rounded-2xl bg-card border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-primary/5 -z-10" />
        
        <Avatar className="h-24 w-24 border-4 border-background shadow-md mt-8">
          <AvatarImage src={session?.user?.image || ""} alt="Avatar" />
          <AvatarFallback className="text-3xl bg-primary/10 text-primary">
            {session?.user?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        
        <div className="mt-8">
          <h1 className="text-3xl font-bold">{session?.user?.name || "Enterprise User"}</h1>
          <p className="text-muted-foreground">{session?.user?.email || "user@enterprise.com"}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Pro Member</Badge>
            <Badge variant="outline">Admin</Badge>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">342</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime questions asked</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents Uploaded</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-muted-foreground mt-1">Contributing to knowledge base</p>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">92%</div>
            <p className="text-xs text-muted-foreground mt-1">Highly accurate responses</p>
          </CardContent>
        </Card>
      </div>

      {/* Query History */}
      <Card className="bg-background/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Recent Query History</CardTitle>
          </div>
          <CardDescription>Your most recent interactions with QueryWise AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{item.query}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={item.confidence > 80 ? "default" : "secondary"} className={item.confidence > 80 ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : ""}>
                      {item.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.confidence}% Conf.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
