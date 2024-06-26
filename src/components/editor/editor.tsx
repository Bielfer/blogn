/* eslint react-hooks/exhaustive-deps:off */
import { useRef, type FC, useEffect, memo } from 'react';
import EditorJS, { type OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import Delimiter from '@editorjs/delimiter';
import Quote from '@editorjs/quote';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import { useField } from 'formik';
import { useToast } from '~/store';
import { tryCatch } from '~/lib/helpers/try-catch';
import { uploadFile } from '~/lib/helpers/firebase';
import { bucketPaths } from '~/lib/constants/firebase';
import { trpc } from '~/lib/trpc';
import Code from './code';

const Editor: FC = () => {
  const holder = 'container';
  const [{ value: data }, , { setValue: setData }] =
    useField<OutputData>('content');
  const ref = useRef<EditorJS>();
  const { addToast } = useToast();
  const { mutateAsync: getSignedUrl } = trpc.file.image.useMutation();

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder,
        tools: {
          code: {
            class: Code as any,
            shortcut: 'CMD+SHIFT+C',
          },
          header: {
            class: Header,
            shortcut: 'CMD+SHIFT+H',
            config: {
              levels: [1, 2, 3],
              defaultLevel: 2,
            },
          },
          paragraph: { class: Paragraph, shortcut: 'CMD+SHIFT+P' },
          delimiter: {
            class: Delimiter,
            shortcut: 'CMD+SHIFT+D',
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O',
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'By John Doe',
            },
          },
          list: { class: List, shortcut: 'CMD+SHIFT+L', inlineToolbar: true },
          image: {
            class: Image,
            shortcut: 'CMD+SHIFT+I',
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  const [image, errorUrl] = await tryCatch(
                    getSignedUrl({
                      bucketPath: bucketPaths.posts,
                      contentType: file.type,
                    })
                  );

                  if (errorUrl) {
                    addToast({
                      type: 'error',
                      content: 'Failed to upload file',
                    });
                    return { success: 0 };
                  }

                  const url = await uploadFile({
                    file,
                    signedUrl: image?.signedUrl,
                    fileName: image?.fileName,
                  });

                  if (!url) {
                    addToast({
                      type: 'error',
                      content: 'Failed to upload file',
                    });
                    return { success: 0 };
                  }

                  return {
                    success: 1,
                    file: {
                      url,
                    },
                  };
                },
                uploadByUrl: () => {
                  addToast({
                    type: 'error',
                    content: "We don't support url pasting upload",
                  });
                  return {
                    success: 0,
                  };
                },
              },
            },
          },
        },
        data,
        async onChange(api) {
          const editorData = await api.saver.save();

          await setData(editorData);
        },
        placeholder: 'You can press TAB to change blocks',
      });
      ref.current = editor;
    }

    return () => {
      if (ref.current?.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return (
    <div
      id={holder}
      className="prose"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Tab') e.preventDefault();
      }}
    />
  );
};

export default memo(Editor);
