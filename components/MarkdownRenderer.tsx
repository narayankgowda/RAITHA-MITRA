
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // FIX: Changed type of `index` to allow string keys, which are used for list items.
  const renderLine = (line: string, index: string | number) => {
    // Bold text: **text**
    const boldedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Headings
    if (boldedLine.startsWith('### ')) {
      return <h3 key={index} className="text-lg font-semibold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: boldedLine.substring(4) }} />;
    }
    if (boldedLine.startsWith('## ')) {
      return <h2 key={index} className="text-xl font-bold mt-6 mb-3" dangerouslySetInnerHTML={{ __html: boldedLine.substring(3) }} />;
    }
    if (boldedLine.startsWith('# ')) {
      return <h1 key={index} className="text-2xl font-extrabold mt-8 mb-4" dangerouslySetInnerHTML={{ __html: boldedLine.substring(2) }} />;
    }

    // Unordered list items
    if (boldedLine.startsWith('- ') || boldedLine.startsWith('* ')) {
      return <li key={index} className="ml-5 list-disc" dangerouslySetInnerHTML={{ __html: boldedLine.substring(2) }} />;
    }
    
    // Paragraphs
    if (boldedLine.trim().length > 0) {
        return <p key={index} className="my-1" dangerouslySetInnerHTML={{ __html: boldedLine }} />;
    }

    return null;
  };

  const lines = content.split('\n');
  const elements = [];
  let listItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = line.startsWith('- ') || line.startsWith('* ');

    if (isListItem) {
      listItems.push(line);
    } else {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${i}`} className="my-2 space-y-1">
            {listItems.map((item, idx) => renderLine(item, `li-${i}-${idx}`))}
          </ul>
        );
        listItems = [];
      }
      elements.push(renderLine(line, i));
    }
  }

  if (listItems.length > 0) {
    elements.push(
      <ul key="ul-last" className="my-2 space-y-1">
        {listItems.map((item, idx) => renderLine(item, `li-last-${idx}`))}
      </ul>
    );
  }

  return <div className="prose dark:prose-invert max-w-none">{elements}</div>;
};

export default MarkdownRenderer;
