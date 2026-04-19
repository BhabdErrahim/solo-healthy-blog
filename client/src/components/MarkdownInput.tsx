"use client";
import React, { useRef, useCallback } from 'react';

interface MarkdownInputProps {
  value: string;
  onChange: (val: string) => void;
}

// ─── Exported utility ─────────────────────────────────────────────────────────

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

// ─── HTML escape helper ───────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ─── Syntax highlighter ───────────────────────────────────────────────────────
//
// Walks the raw markdown string with a regex, wraps every markdown link
// [text](url) in a styled <span>.  Image syntax ![...](...) is deliberately
// skipped so images stay in the normal emerald colour.
//
// External links  (https?://)  → orange  #fb923c
// Internal links  (/…  or  #…) → blue    #60a5fa
//
// ONLY font-weight and colour are changed – NO font-size change – so the
// character grid stays pixel-perfect between the backdrop and the textarea.

function buildHighlightedHtml(text: string): string {
  // Matches [label](url) where url starts with http(s), / or #
  const LINK_RE = /\[([^\]]*)\]\(((?:https?:\/\/|\/|#)[^)]*)\)/g;
  const out: string[] = [];
  let cursor = 0;
  let m: RegExpExecArray | null;

  while ((m = LINK_RE.exec(text)) !== null) {
    const start = m.index;

    // Skip image syntax: the char immediately before [ is !
    if (start > 0 && text[start - 1] === '!') {
      out.push(escapeHtml(text.slice(cursor, start + m[0].length)));
      cursor = start + m[0].length;
      continue;
    }

    // Plain text before this link
    if (start > cursor) {
      out.push(escapeHtml(text.slice(cursor, start)));
    }

    const url = m[2];
    const isExternal = /^https?:\/\//i.test(url);
    const escaped = escapeHtml(m[0]);

    if (isExternal) {
      // ── External link: orange glow ──────────────────────────────────────────
      out.push(
        `<span style="` +
          `color:#fb923c;` +
          `font-weight:900;` +
          `background:rgba(251,146,60,0.13);` +
          `border-radius:3px;` +
          `text-shadow:0 0 10px rgba(251,146,60,0.65),0 0 20px rgba(251,146,60,0.3);` +
        `">${escaped}</span>`
      );
    } else {
      // ── Internal link: blue glow ────────────────────────────────────────────
      out.push(
        `<span style="` +
          `color:#60a5fa;` +
          `font-weight:900;` +
          `background:rgba(96,165,250,0.13);` +
          `border-radius:3px;` +
          `text-shadow:0 0 10px rgba(96,165,250,0.65),0 0 20px rgba(96,165,250,0.3);` +
        `">${escaped}</span>`
      );
    }

    cursor = start + m[0].length;
  }

  // Remaining text after the last link
  if (cursor < text.length) {
    out.push(escapeHtml(text.slice(cursor)));
  }

  return out.join('');
}

// ─── Shared typography / spacing ──────────────────────────────────────────────
//
// The backdrop <div> and the <textarea> MUST have identical font metrics and
// padding so every character occupies the same pixel position in both layers.

const SHARED: React.CSSProperties = {
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  fontSize: '14px',
  lineHeight: '1.625',        // Tailwind leading-relaxed
  letterSpacing: '0em',
  tabSize: 2,
  paddingTop: '48px',         // pt-12
  paddingRight: '40px',       // p-10
  paddingBottom: '40px',
  paddingLeft: '40px',
  whiteSpace: 'pre',
  wordBreak: 'normal',
  overflowWrap: 'normal',
};

// ─── Component ────────────────────────────────────────────────────────────────

const MarkdownInput = ({ value, onChange }: MarkdownInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Keep backdrop scroll position in sync with textarea
  const syncScroll = useCallback(() => {
    if (backdropRef.current && textareaRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain');
    const repaired = normalizeImageTags(pasted);
    const start = textareaRef.current?.selectionStart ?? 0;
    const end = textareaRef.current?.selectionEnd ?? 0;
    const newValue = value.substring(0, start) + repaired + value.substring(end);
    onChange(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Deep-clean image tags when the user leaves the editor
  const handleBlur = () => {
    onChange(normalizeImageTags(value));
  };

  // Append a trailing newline so the last line in the backdrop has the same
  // height as the textarea (prevents a 1-line vertical misalignment at EOF).
  const highlightedHtml = buildHighlightedHtml(value) + '\n';

  return (
    <div className="relative w-full group">

      {/* ── Top-left badge ────────────────────────────────────────────────── */}
      <div className="absolute -top-3 left-6 px-3 py-1 bg-[#E4580B] text-white text-[10px] font-black uppercase tracking-widest rounded-full z-20 shadow-lg pointer-events-none">
        Raw Markdown Stream
      </div>

      {/* ── Link-type legend (top-right) ──────────────────────────────────── */}
      <div className="absolute -top-3 right-6 flex items-center gap-2 z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-[#0f172a] border border-blue-500/40 px-2.5 py-1 rounded-full">
          <span
            className="w-2 h-2 rounded-full bg-blue-400 shrink-0"
            style={{ boxShadow: '0 0 6px rgba(96,165,250,0.9)' }}
          />
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">
            Internal
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0f172a] border border-orange-400/40 px-2.5 py-1 rounded-full">
          <span
            className="w-2 h-2 rounded-full bg-orange-400 shrink-0"
            style={{ boxShadow: '0 0 6px rgba(251,146,60,0.9)' }}
          />
          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wide">
            External
          </span>
        </div>
      </div>

      {/* ── Editor shell ─────────────────────────────────────────────────── */}
      <div
        className="relative w-full h-[820px] rounded-[3rem] overflow-hidden shadow-2xl focus-within:ring-4 focus-within:ring-[#114AB1]/25 transition-all"
        style={{ background: '#0f172a' }}
      >

        {/* ── Layer 1: highlight backdrop ──────────────────────────────────
            Sits behind the textarea.  overflow:hidden means scrollbars are
            hidden, but scrollTop / scrollLeft still work (set by syncScroll).  */}
        <div
          ref={backdropRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            ...SHARED,
            color: '#34d399',   // emerald-400 for regular markdown text
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />

        {/* ── Layer 2: transparent textarea ────────────────────────────────
            Text is invisible (color:transparent) so only the backdrop
            colour shows through.  The caret is still emerald green.        */}
        <textarea
          ref={textareaRef}
          value={value}
          onPaste={handlePaste}
          onChange={handleChange}
          onBlur={handleBlur}
          onScroll={syncScroll}
          spellCheck={false}
          wrap="off"
          className="absolute inset-0 w-full h-full resize-none outline-none custom-scrollbar"
          style={{
            ...SHARED,
            color: 'transparent',
            caretColor: '#34d399',
            background: 'transparent',
            overflowX: 'auto',
            overflowY: 'auto',
          }}
        />

        {/* ── Layer 3: custom placeholder (shown only when empty) ───────── */}
        {!value && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none"
            style={{
              ...SHARED,
              color: 'rgba(52,211,153,0.18)',
            }}
          >
            {`---\ntitle: "Your Article Title"\nslug: "your-article-slug"\nexcerpt: "Brief description of the article..."\ncategory: "Healthy"\nfeatured: false\nstatus: "draft"\n---\n\nStart writing your article here...\n\nInternal link example:  [Read more](/blog/post-slug)\nExternal link example:  [Visit Site](https://example.com)`}
          </div>
        )}

      </div>

      {/* ── Status bar ───────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 right-8 flex items-center gap-2 opacity-50 font-mono pointer-events-none">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
          URL_SHIELD · Active
        </span>
      </div>
    </div>
  );
};

export default MarkdownInput;