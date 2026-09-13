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

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const sanitizeArticleHtml = (html = '') => {
  if (!html) return '';
  if (typeof DOMParser === 'undefined') return escapeHtml(html);

  const documentNode = new DOMParser().parseFromString(`<div id="nre-content-root">${html}</div>`, 'text/html');
  const root = documentNode.getElementById('nre-content-root');
  if (!root) return '';

  const allowedTags = new Set(['P', 'H2', 'H3', 'STRONG', 'B', 'EM', 'I', 'U', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'BR', 'A']);
  const removeEntirely = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH', 'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'LINK', 'META']);

  [...root.querySelectorAll('*')].reverse().forEach((element) => {
    if (removeEntirely.has(element.tagName)) {
      element.remove();
      return;
    }
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...element.childNodes);
      return;
    }

    [...element.attributes].forEach((attribute) => {
      const allowed = element.tagName === 'A' && ['href', 'title'].includes(attribute.name.toLowerCase());
      if (!allowed) element.removeAttribute(attribute.name);
    });

    if (element.tagName === 'A') {
      const href = (element.getAttribute('href') || '').trim();
      if (href && !/^(https:\/\/|mailto:|\/)/i.test(href)) element.removeAttribute('href');
      element.setAttribute('rel', 'noopener noreferrer nofollow');
    }
  });

  return root.innerHTML;
};

/**
 * Converts legacy markdown into allowlisted HTML. Raw HTML is sanitized before
 * it is rendered or inserted into the editor.
 */
export const markdownToHtml = (markdown = '') => {
  if (!markdown) return '';

  // Fix any legacy malformed headings containing embedded newlines/paragraphs
  if (markdown.includes('</h3>') || markdown.includes('</h2>')) {
    markdown = markdown.replace(/<(h[23])>([\s\S]*?)<\/\1>/gi, (match, tag, innerText) => {
      if (innerText.includes('\n')) {
        const lines = innerText.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length > 1) {
          const heading = `<${tag}>${lines[0]}</${tag}>`;
          const rest = lines.slice(1).map((l) => `<p>${l}</p>`).join('');
          return heading + rest;
        }
      }
      return match;
    });
  }

  // Existing rich HTML still passes through the allowlist sanitizer.
  if (/<(p|ul|ol|blockquote)[\s>]/i.test(markdown) && !markdown.includes('### ') && !markdown.includes('## ')) {
    return sanitizeArticleHtml(markdown);
  }

  const formatInline = (str = '') => {
    return escapeHtml(str)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  const lines = markdown.split('\n');
  let html = '';
  let inList = null;
  let currentParagraph = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim();
      if (text) {
        html += `<p>${formatInline(text)}</p>`;
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (inList) {
      html += `</${inList}>`;
      inList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      html += `<h3>${formatInline(line.replace(/^###\s+/, ''))}</h3>`;
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      html += `<h2>${formatInline(line.replace(/^##\s+/, ''))}</h2>`;
      continue;
    }
    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      html += `<h2>${formatInline(line.replace(/^#\s+/, ''))}</h2>`;
      continue;
    }
    if (line.startsWith('> ')) {
      flushParagraph();
      flushList();
      html += `<blockquote>${formatInline(line.replace(/^>\s+/, ''))}</blockquote>`;
      continue;
    }
    if (line.startsWith('* ') || line.startsWith('- ')) {
      flushParagraph();
      if (inList !== 'ul') {
        flushList();
        html += '<ul>';
        inList = 'ul';
      }
      html += `<li>${formatInline(line.replace(/^[\*\-]\s+/, ''))}</li>`;
      continue;
    }
    const numMatch = line.match(/^\d+\.\s+(.*)$/);
    if (numMatch) {
      flushParagraph();
      if (inList !== 'ol') {
        flushList();
        html += '<ol>';
        inList = 'ol';
      }
      html += `<li>${formatInline(numMatch[1])}</li>`;
      continue;
    }
    flushList();
    currentParagraph.push(line);
  }
  flushParagraph();
  flushList();
  return sanitizeArticleHtml(html);
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
    const tagArg = tag.startsWith('<') ? tag : `<${tag}>`;
    executeCommand('formatBlock', tagArg);
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
