'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    // Check if content has base64 images
    const hasBase64Images = content.includes('![') && content.includes('data:image');

    if (hasBase64Images) {
        // For content with base64 images, convert to HTML and render directly
        let htmlContent = content;

        // Convert markdown images to HTML img tags
        htmlContent = htmlContent.replace(/!\[([^\]]*)\]\((data:image[^\)]+)\)/g,
            '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 0.5rem;" loading="lazy" />');

        // Convert markdown headings
        htmlContent = htmlContent.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        htmlContent = htmlContent.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        htmlContent = htmlContent.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Convert bold and italic
        htmlContent = htmlContent.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
        htmlContent = htmlContent.replace(/\*([^\*]+)\*/g, '<em>$1</em>');

        // Convert inline code
        htmlContent = htmlContent.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Convert line breaks
        htmlContent = htmlContent.replace(/\n/g, '<br />');

        return (
            <div
                className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        );
    }

    // For regular markdown without base64, use ReactMarkdown
    return (
        <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    img: ({ node, src, alt, ...props }) => {
                        if (!src || (typeof src === 'string' && src.trim() === '')) {
                            return null;
                        }

                        const srcString = typeof src === 'string' ? src : '';
                        return (
                            <img
                                src={srcString}
                                alt={alt || 'Image'}
                                {...props}
                                className="rounded-lg max-w-full h-auto"
                                style={{ maxWidth: '100%', height: 'auto' }}
                                loading="lazy"
                            />
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
