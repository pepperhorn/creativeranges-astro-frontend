'use client';

import { setAttr } from '@directus/visual-editing';
import DirectusImage from '@/components/shared/DirectusImage';
import Headline from '@/components/ui/Headline';
import BaseText from '@/components/ui/Text';
import Button from './Button';

interface ContentProps {
  data: {
    id: string;
    headline?: string | null;
    tagline?: string | null;
    content?: string | null;
    image?: string | null;
    image_position?: 'left' | 'right' | null;
    button?: any | null;
  };
}

export default function Content({ data }: ContentProps) {
  const { id, headline, tagline, content, image, image_position = 'right', button } = data;
  const imageOnLeft = image_position === 'left';

  return (
    <div
      className={`block-content grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${imageOnLeft ? 'lg:grid-flow-dense' : ''}`}
    >
          {/* Text Content */}
          <div className={imageOnLeft ? 'lg:col-start-2' : ''}>
            {tagline && (
              <p
                className="text-sm font-semibold uppercase tracking-wider text-accent mb-2"
                data-directus={setAttr({
                  collection: 'block_content',
                  item: id,
                  fields: 'tagline',
                  mode: 'popover',
                })}
              >
                {tagline}
              </p>
            )}

            {headline && (
              <Headline
                as="h2"
                headline={headline}
                className="mb-4"
                data-directus={setAttr({
                  collection: 'block_content',
                  item: id,
                  fields: 'headline',
                  mode: 'popover',
                })}
              />
            )}

            {content && (
              <BaseText
                content={content}
                className="text-lg text-muted-foreground mb-6"
                data-directus={setAttr({
                  collection: 'block_content',
                  item: id,
                  fields: 'content',
                  mode: 'drawer',
                })}
              />
            )}

            {button && <Button {...button} />}
          </div>

          {/* Image */}
          {image && (
            <div
              className={imageOnLeft ? 'lg:col-start-1 lg:row-start-1' : ''}
              data-directus={setAttr({
                collection: 'block_content',
                item: id,
                fields: 'image',
                mode: 'modal',
              })}
            >
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <DirectusImage
                  uuid={image}
                  alt={headline || 'Content image'}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              </div>
            </div>
          )}
    </div>
  );
}

