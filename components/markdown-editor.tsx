'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">✏️ Edit</TabsTrigger>
          <TabsTrigger value="preview">👁️ Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-4">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Write your markdown here...\n\n# Heading\n\n**Bold** *Italic*\n\n```javascript\nconst hello = "world";\n```'}
            className="min-h-[500px] font-mono text-sm"
          />
          <div className="mt-2 text-xs text-muted-foreground">
            💡 Supports: Headings, Bold, Italic, Code blocks, Lists, Tables, Links, Images
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="min-h-[500px] p-4 border rounded-md bg-muted/50">
            {value ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Preview will appear here...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
