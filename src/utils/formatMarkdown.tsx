import React from 'react';

export const FormattedMarkdown: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header ###
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-3 mb-1 tracking-tight">
              {renderInlineBold(trimmed.slice(4))}
            </h3>
          );
        }

        // Horizontal Rule ---
        if (trimmed === '---') {
          return <hr key={idx} className="border-slate-200 dark:border-slate-800 my-2" />;
        }

        // Blockquote >
        if (trimmed.startsWith('> ')) {
          return (
            <div key={idx} className="p-3 rounded-xl bg-cyan-500/10 border-l-4 border-cyan-500 text-xs text-slate-800 dark:text-slate-200 my-2 italic">
              {renderInlineBold(trimmed.slice(2))}
            </div>
          );
        }

        // Bullet Point -
        if (trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-cyan-500 font-bold shrink-0 mt-0.5">•</span>
              <span>{renderInlineBold(trimmed.slice(2))}</span>
            </div>
          );
        }

        // Regular Paragraph
        return (
          <p key={idx}>
            {renderInlineBold(line)}
          </p>
        );
      })}
    </div>
  );
};

function renderInlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-slate-900 dark:text-cyan-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-slate-700 dark:text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 font-mono text-[11px] text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
