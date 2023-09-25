import editorJsHtml from 'editorjs-html';

export const editorJsToHtml = () =>
  editorJsHtml({
    delimiter: () => (
      <div className="flex items-center justify-center gap-x-1">
        <span className="text-lg">*</span>
        <span className="text-lg">*</span>
        <span className="text-lg">*</span>
      </div>
    ),
  });
