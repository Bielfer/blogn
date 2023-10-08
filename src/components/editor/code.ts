/* eslint @typescript-eslint/class-literal-property-style:off */
import { IconBrackets } from '@codexteam/icons';
import { type BlockToolConstructorOptions } from '@editorjs/editorjs';
import { supportedLanguages } from '~/lib/constants/code-blocks';

export function getLineStartPosition(str: string, position: number) {
  const charLength = 1;
  let char = '';

  while (char !== '\n' && position > 0) {
    position = position - charLength;
    char = str.slice(position, position + charLength);
  }

  if (char === '\n') {
    position += 1;
  }

  return position;
}

type Data = {
  code: string;
  language: keyof typeof supportedLanguages;
};

type Nodes = {
  textarea: HTMLTextAreaElement | null;
  select: HTMLSelectElement | null;
  wrapper: HTMLDivElement | null;
};

export default class Code {
  blockApi;
  _data: Data | null = null;
  nodes: Nodes;

  constructor({ data, block }: BlockToolConstructorOptions<Data, any>) {
    this.blockApi = block;
    this.data = {
      code: data.code ?? '',
      language: data.language ?? 'javascript',
    };
    this.nodes = {
      textarea: null,
      select: null,
      wrapper: null,
    };

    this.nodes.wrapper = this.drawView();
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'Code',
      icon: IconBrackets,
    };
  }

  get data() {
    return this._data ?? { code: '', language: 'javascript' };
  }

  set data(data: Data) {
    this._data = data;

    if (!this.nodes) return;

    if (this.nodes.textarea) {
      this.nodes.textarea.textContent = data.code;
    }
    if (this.nodes.select) {
      this.nodes.select.value = data.language;
    }
  }

  render() {
    return this.nodes.wrapper;
  }

  drawView() {
    const wrapper = document.createElement('div');
    const textarea = document.createElement('textarea');
    const select = document.createElement('select');

    wrapper.setAttribute(
      'class',
      'relative overflow-hidden border border-gray-300 rounded-lg pt-7 bg-gray-50 pb-0'
    );
    select.setAttribute(
      'class',
      'absolute top-2 left-1 rounded-lg text-xs border-0 focus:border-0 text-gray-700 focus:ring-0 bg-transparent py-0'
    );
    textarea.setAttribute(
      'class',
      'w-full border-none focus:ring-0 focus:border-none pb-3 px-3 text-sm focus:border-current shadow-0 bg-transparent'
    );
    textarea.setAttribute('placeholder', 'Enter your code ...');

    for (const [lang, langName] of Object.entries(supportedLanguages)) {
      const opt = document.createElement('option');

      if (lang === 'javascript') opt.selected = true;

      opt.value = lang;
      opt.innerHTML = langName;
      select.appendChild(opt);
    }

    textarea.value = this.data.code;
    select.value = this.data.language;

    wrapper.append(textarea);
    wrapper.append(select);

    textarea.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'Tab':
          this.tabHandler(event);
          break;
      }
    });

    select.addEventListener('change', (event) => {
      this.data.language = (event.target as HTMLTextAreaElement)
        .value as keyof typeof supportedLanguages;
      this.blockApi?.dispatchChange();
    });

    this.nodes.textarea = textarea;
    this.nodes.select = select;

    return wrapper;
  }

  save(blockContent: HTMLDivElement) {
    const textarea = blockContent.querySelector('textarea');
    const select = blockContent.querySelector('select');

    return {
      code: textarea?.value,
      language: select?.value,
    };
  }

  tabHandler(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();

    const textarea = event.target as HTMLTextAreaElement;
    const isShiftPressed = event.shiftKey;
    const caretPosition = textarea?.selectionStart;
    const value = textarea.value;
    const indentation = '  ';

    let newCaretPosition;

    if (!isShiftPressed) {
      newCaretPosition = caretPosition + indentation.length;

      textarea.value =
        value.substring(0, caretPosition) +
        indentation +
        value.substring(caretPosition);
    } else {
      const currentLineStart = getLineStartPosition(value, caretPosition);
      const firstLineChars = value.slice(
        currentLineStart,
        currentLineStart + indentation.length
      );

      if (firstLineChars !== indentation) {
        return;
      }

      textarea.value =
        value.substring(0, currentLineStart) +
        value.substring(currentLineStart + indentation.length);
      newCaretPosition = caretPosition - indentation.length;
    }

    textarea.setSelectionRange(newCaretPosition, newCaretPosition);
  }

  static get sanitize() {
    return {
      code: true,
    };
  }
}
