import editorJsHtml from 'editorjs-html';
import { type supportedLanguages } from '../constants/code-blocks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

type BaseBlock<T extends object> = {
  data: T;
  id: string;
  type: string;
};

export const editorJsToHtml = () =>
  editorJsHtml({
    delimiter: () => (
      <div className="flex items-center justify-center gap-x-1">
        <span className="text-lg">*</span>
        <span className="text-lg">*</span>
        <span className="text-lg">*</span>
      </div>
    ),
    code: (
      block: BaseBlock<{
        code: string;
        language: keyof typeof supportedLanguages;
      }>
    ) => (
      <div className="not-prose">
        <SyntaxHighlighter
          showLineNumbers
          language={block.data.language}
          style={dracula}
        >
          {block.data.code}
        </SyntaxHighlighter>
      </div>
    ),
  });
