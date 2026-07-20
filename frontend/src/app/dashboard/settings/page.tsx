import { Settings as SettingsIcon, Shield, Key, Bell, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your enterprise AI preferences and API integrations.</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>API Configuration</CardTitle>
            </div>
            <CardDescription>Configure your LLM providers (Featherless AI, OpenAI, Gemini).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div>
                <h4 className="font-medium text-sm">Featherless AI</h4>
                <p className="text-xs text-muted-foreground">Using OpenAI-compatible endpoint</p>
              </div>
              <Button variant="outline" size="sm">Edit Keys</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div>
                <h4 className="font-medium text-sm">Google Embeddings</h4>
                <p className="text-xs text-muted-foreground">models/gemini-embedding-2</p>
              </div>
              <Button variant="outline" size="sm">Edit Keys</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Vector Database</CardTitle>
            </div>
            <CardDescription>Manage Qdrant settings and document stores.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div>
                <h4 className="font-medium text-sm">Qdrant Local</h4>
                <p className="text-xs text-muted-foreground">Connected to localhost:6333</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
