"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { CodeBlock } from "@/components/primitives/CodeBlock";

type MarkdownProps = {
  children: string;
  className?: string;
};

export const Markdown: React.FC<MarkdownProps> = ({ children, className }) => {
  type CodeProps = {
    node?: unknown;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
  };

  const components: Components = {
    code: (({ inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || "");
      const content = String(children).replace(/\n$/, "");
      if (!inline) {
        return <CodeBlock language={(match && match[1]) || ""} value={content} />;
      }
      return (
        <code className="font-mono px-1.5 py-0.5 rounded-md bg-surface2 text-[13px]" {...props}>
          {children}
        </code>
      );
    }) as unknown as Components["code"],
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 pl-4 text-text2 border-accent/40">
          {children}
        </blockquote>
      );
    },
    a({ children, href }) {
      return (
        <a
          href={href as string}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-accent/60 underline-offset-4 hover:decoration-accent"
        >
          {children}
        </a>
      );
    },
    table({ children }) {
      return (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-sm border-collapse w-full overflow-hidden rounded-lg border border-border">{children}</table>
        </div>
      );
    },
    th({ children }) {
      return <th className="text-left border-b px-3 py-2 bg-surface2 text-text2">{children}</th>;
    },
    td({ children }) {
      return <td className="border-b px-3 py-2 align-top">{children}</td>;
    },
    img({ src, alt }) {
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={(src as string) || ""} alt={alt || ""} className="max-w-full rounded-lg border border-border shadow-soft" />
          {alt ? <figcaption className="mt-1 text-xs text-text2">{alt}</figcaption> : null}
        </figure>
      );
    },
    ul({ children }) {
      return <ul className="list-disc pl-6 space-y-1">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-6 space-y-1">{children}</ol>;
    },
    p({ children }) {
      return <p className="text-[16px] leading-[1.7] text-text1">{children}</p>;
    },
    h1({ children }) {
      return <h1 className="text-3xl font-semibold tracking-[-0.01em]">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="text-2xl font-semibold tracking-[-0.01em]">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-xl font-semibold">{children}</h3>;
    },
  };

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeSlug, [rehypeAutolinkHeadings, { behavior: "append" }]]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};


