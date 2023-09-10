import { type OutputData } from '@editorjs/editorjs';
import { useField } from 'formik';
import type { FC } from 'react';
import editorJsHtml from 'editorjs-html';
import Container from '~/components/container';
import Button from '~/components/button';
import EmptyState from '~/components/empty-state';
import { HiMiniArrowUturnLeft, HiOutlinePencilSquare } from 'react-icons/hi2';

const toHtml = editorJsHtml();

type Props = {
  handleClose: () => void;
};

const PostPreview: FC<Props> = ({ handleClose }) => {
  const [{ value: title }] = useField<string>('title');
  const [{ value: data }] = useField<OutputData>('content');
  const postHasContent = data.blocks.length > 0;

  let html: string[] | undefined;

  if (postHasContent) html = toHtml.parse(data);

  return (
    <>
      <Container className="flex justify-end">
        <Button onClick={handleClose} iconLeft={HiMiniArrowUturnLeft}>
          Go Back
        </Button>
      </Container>
      <Container smallerContainer>
        <h1 className="py-8">{title}</h1>
        {postHasContent ? (
          <div className="prose max-w-full" key={data.time}>
            {html?.map((item, index) => {
              if (typeof item === 'string') {
                return (
                  <div dangerouslySetInnerHTML={{ __html: item }} key={index} />
                );
              }
              return item;
            })}
          </div>
        ) : (
          <EmptyState
            icon={HiOutlinePencilSquare}
            title="No content was created yet"
            subtitle="You can start your post by going back and pressing TAB"
          />
        )}
      </Container>
    </>
  );
};

export default PostPreview;
