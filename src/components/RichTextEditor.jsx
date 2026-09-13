import React, { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Type,
  RemoveFormatting,
  Undo,
  Redo
} from 'lucide-react';

/**
 * Converts legacy markdown (###, **, *, etc.) into clean HTML
 * so existing blog posts render flawlessly in the visual editor.
 */
export const markdownToHtml = (markdown = '') => {
  if (!markdown) return '';

  // If already full HTML, return as is
  if (/<(h[1-6]|p|ul|ol|li|blockquote|strong|b|em)[\s>]/i.test(markdown)) {
    return markdown;
  }

  const formatInline = (str = '') => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  const blocks = markdown.trim().split(/\n\s*\n/);

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';

      // Heading 3
      if (trimmed.startsWith('### ')) {
        const text = trimmed.replace(/^###\s+/, '');
        return `<h3>${formatInline(text)}</h3>`;
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace(/^##\s+/, '');
        return `<h2>${formatInline(text)}</h2>`;
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        const text = trimmed.replace(/^>\s+/, '');
        return `<blockquote>${formatInline(text)}</blockquote>`;
      }

      // Lines processing for bullet and numbered lists
      const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
      const hasBullets = lines.some((l) => l.startsWith('* ') || l.startsWith('- '));
      const hasNumbered = lines.some((l) => /^\d+\.\s+/.test(l));

      if (hasBullets) {
        let html = '';
        let inList = false;
        lines.forEach((l) => {
          if (l.startsWith('* ') || l.startsWith('- ')) {
            if (!inList) {
              html += '<ul>';
              inList = true;
            }
            html += `<li>${formatInline(l.replace(/^[\*\-]\s+/, ''))}</li>`;
          } else {
            if (inList) {
              html += '</ul>';
              inList = false;
            }
            html += `<p>${formatInline(l)}</p>`;
          }
        });
        if (inList) html += '</ul>';
        return html;
      }

      if (hasNumbered) {
        let html = '';
        let inList = false;
        lines.forEach((l) => {
          const match = l.match(/^\d+\.\s+(.*)$/);
          if (match) {
            if (!inList) {
              html += '<ol>';
              inList = true;
            }
            html += `<li>${formatInline(match[1])}</li>`;
          } else {
            if (inList) {
              html += '</ol>';
              inList = false;
            }
            html += `<p>${formatInline(l)}</p>`;
          }
        });
        if (inList) html += '</ol>';
        return html;
      }

      return `<p>${formatInline(trimmed.replace(/\n/g, '<br/>'))}</p>`;
    })
    .join('');
};

export const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Escribe aquí el contenido del artículo...',
  minHeight = '320px',
}) => {
  const editorRef = useRef(null);
  const isInternalUpdate = useRef(false);
  const [selectedFormat, setSelectedFormat] = useState('p');

  // Initialize and sync content
  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const htmlContent = markdownToHtml(value);
    if (editorRef.current.innerHTML !== htmlContent) {
      editorRef.current.innerHTML = htmlContent;
    }
  }, [value]);

  const triggerChange = () => {
    if (!editorRef.current) return;
    isInternalUpdate.current = true;
    const html = editorRef.current.innerHTML;
    if (onChange) {
      onChange(html);
    }
  };

  // Prevent toolbar buttons from stealing focus so the text selection is preserved
  const executeCommand = (command, val = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, val);
    triggerChange();
  };

  const handleFormatBlock = (tag) => {
    setSelectedFormat(tag);
    executeCommand('formatBlock', tag);
  };

  return (
    <div className="rounded-2xl border border-[#DFD5C4] bg-white shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-[#C59A47] focus-within:border-[#C59A47] transition-all">
      {/* RICH TEXT TOOLBAR */}
      <div className="bg-[#FAF7F2] border-b border-[#DFD5C4] p-2 sm:p-2.5 flex flex-wrap items-center gap-1.5 text-xs text-[#0B1E14]">
        
        {/* Style Selector Dropdown */}
        <div className="flex items-center gap-1 bg-white border border-[#DFD5C4] rounded-xl px-2 py-1 shadow-2xs">
          <Type className="w-3.5 h-3.5 text-[#C59A47]" />
          <select
            value={selectedFormat}
            onChange={(e) => handleFormatBlock(e.target.value)}
            className="bg-transparent text-xs font-semibold text-[#0B1E14] outline-none cursor-pointer pr-1"
            title="Estilo de texto"
          >
            <option value="p">Párrafo Normal</option>
            <option value="h2">Título Principal (H2)</option>
            <option value="h3">Subtítulo (H3)</option>
            <option value="blockquote">Cita Destacada</option>
          </select>
        </div>

        <div className="h-5 w-px bg-[#DFD5C4] mx-1"></div>

        {/* Character Styles: Bold, Italic, Underline */}
        <div className="flex items-center bg-white border border-[#DFD5C4] rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('bold');
            }}
            className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B1E14] font-bold transition-colors cursor-pointer"
            title="Negrita (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('italic');
            }}
            className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B1E14] italic transition-colors cursor-pointer"
            title="Cursiva (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('underline');
            }}
            className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B1E14] underline transition-colors cursor-pointer"
            title="Subrayado (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-[#DFD5C4] mx-1"></div>

        {/* Lists & Quotes */}
        <div className="flex items-center bg-white border border-[#DFD5C4] rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertUnorderedList');
            }}
            className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B1E14] transition-colors cursor-pointer flex items-center gap-1"
            title="Lista con viñetas"
          >
            <List className="w-3.5 h-3.5 text-[#153A26]" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertOrderedList');
            }}
            className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B1E14] transition-colors cursor-pointer flex items-center gap-1"
            title="Lista numerada"
          >
            <ListOrdered className="w-3.5 h-3.5 text-[#153A26]" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatBlock('blockquote');
            }}
            className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B1E14] transition-colors cursor-pointer"
            title="Cita destacada"
          >
            <Quote className="w-3.5 h-3.5 text-[#C59A47]" />
          </button>
        </div>

        <div className="h-5 w-px bg-[#DFD5C4] mx-1"></div>

        {/* Utilities: Clear format, Undo, Redo */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('removeFormat');
            }}
            className="p-1.5 rounded-lg hover:bg-white text-[#5C6B62] hover:text-[#0B1E14] transition-colors cursor-pointer"
            title="Limpiar formato"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('undo');
            }}
            className="p-1.5 rounded-lg hover:bg-white text-[#5C6B62] hover:text-[#0B1E14] transition-colors cursor-pointer"
            title="Deshacer"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('redo');
            }}
            className="p-1.5 rounded-lg hover:bg-white text-[#5C6B62] hover:text-[#0B1E14] transition-colors cursor-pointer"
            title="Rehacer"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* EDITABLE CONTENT WORKSPACE */}
      <div
        ref={editorRef}
        contentEditable
        onInput={triggerChange}
        onBlur={triggerChange}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className="rich-editor-content p-5 sm:p-6 text-sm text-[#2C3531] leading-relaxed outline-none focus:outline-none overflow-y-auto"
      />
    </div>
  );
};
