"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface DocumentRecord {
  id: string;
  filename: string;
  status: string;
  upload_date: string;
  size: number;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const data = await apiClient.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Auto-refresh if any document is still processing
  useEffect(() => {
    const isProcessing = documents.some(doc => doc.status === 'Processing');
    if (isProcessing) {
      const timer = setTimeout(() => {
        fetchDocuments();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [documents]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      setError("Currently only PDF files are supported.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      await apiClient.uploadDocument(file);
      await fetchDocuments(); // Refresh list after upload
    } catch (err: any) {
      setError(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Indexed':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Indexed</Badge>;
      case 'Processing':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing</Badge>;
      case 'Failed':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20"><AlertCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col max-w-6xl mx-auto p-4 md:p-8 gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">Upload and manage your enterprise documents for AI retrieval.</p>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        
        {/* Upload Zone */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>Supported formats: .pdf</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-lg p-6 text-center space-y-4 bg-muted/20">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UploadCloud className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Drag & drop your file here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse from your computer</p>
            </div>
            
            {error && (
              <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-md w-full">{error}</p>
            )}

            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button 
              className="w-full" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
              ) : (
                'Select File'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>You have {documents.length} document{documents.length !== 1 ? 's' : ''} in your knowledge base.</CardDescription>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Size</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {doc.filename}
                        </td>
                        <td className="p-4 align-middle">
                          {getStatusBadge(doc.status)}
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {formatSize(doc.size)}
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {new Date(doc.upload_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
