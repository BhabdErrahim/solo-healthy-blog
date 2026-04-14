"use client";
import React, { useRef } from 'react';

interface MarkdownInputProps {
  value: string;
  onChange: (val: string) => void;
}

export function normalizeImageTags(raw: string): string {
  if (!raw) return '';

  let fixed = raw.replace(/!\[([^\]]*)\]\s*[\r\n]+\s*\(/g, '![$1](');

  fixed = fixed.replace(
    /!\[([^\]]*)\]\((https?[\s\S]*?)\)/g,
    (_: string, alt: string, url: string) =>
      `\n\n![${alt}](${url.replace(/\s+/g, '')})\n\n`
  );

  fixed = fixed.replace(/\n{3,}/g, '\n\n');

  return fixed;
}

const MarkdownInput = ({ value, onChange }: MarkdownInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain');
    const repaired = normalizeImageTags(pasted);

    const start = textareaRef.current?.selectionStart ?? 0;
    const end = textareaRef.current?.selectionEnd ?? 0;
    const newValue = value.substring(0, start) + repaired + value.substring(end);
    onChange(newValue);
  };

  // FIX: Removed normalizeImageTags from here to stop the cursor jumping
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // NEW: Performs a final "Deep Clean" when you stop editing the box
  const handleBlur = () => {
    onChange(normalizeImageTags(value));
  };

  return (
    <div className="relative w-full group">
      <div className="absolute -top-3 left-6 px-3 py-1 bg-[#E4580B] text-white text-[10px] font-black uppercase tracking-widest rounded-full z-10 shadow-lg">
        Raw Markdown Stream
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onPaste={handlePaste}
        onChange={handleChange}
        onBlur={handleBlur} // Deep clean on exit
        spellCheck={false}
        wrap="off"
        placeholder="Paste your .md file content here..."
        className="w-full h-[820px] p-10 pt-12 bg-[#0f172a] text-emerald-400 font-mono text-sm rounded-[3rem] border-4 border-transparent focus:border-[#114AB1]/30 outline-none shadow-2xl leading-relaxed resize-none overflow-x-auto custom-scrollbar transition-all"
        style={{ whiteSpace: 'pre' }}
      />

      <div className="absolute bottom-6 right-8 flex items-center gap-2 opacity-50 font-mono">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
          URL_SHIELD · Active
        </span>
      </div>
    </div>
  );
};

export default MarkdownInput;