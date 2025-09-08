"use client";

import React from "react";

type Artifact = { id: string; name: string; url?: string; mime?: string };

export const ArtifactCard: React.FC<{ artifact: Artifact }> = ({ artifact }) => {
  const { url, name, mime } = artifact;
  const isImage = mime?.startsWith("image/") || (url && /(png|jpg|jpeg|gif|webp)$/i.test(url));
  const isText = mime?.includes("json") || mime?.startsWith("text/");

  return (
    <div className="border border-border rounded-xl p-3 bg-[var(--surface)]">
      <div className="text-sm font-medium mb-2">{name}</div>
      {isImage && url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={name} className="max-w-full rounded-md" />
      ) : isText && url ? (
        <iframe title={name} src={url} className="w-full h-64 rounded-md border border-border" />
      ) : url ? (
        <a href={url} target="_blank" rel="noreferrer" className="underline text-[var(--accent)]">open</a>
      ) : (
        <div className="text-xs text-secondary">artifact added</div>
      )}
    </div>
  );
};


