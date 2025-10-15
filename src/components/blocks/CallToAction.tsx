'use client';

import { setAttr } from '@directus/visual-editing';
import Headline from '@/components/ui/Headline';
import BaseText from '@/components/ui/Text';
import ButtonGroup from './ButtonGroup';

interface CallToActionProps {
  data: {
    id: string;
    headline?: string | null;
    tagline?: string | null;
    content?: string | null;
    button_group?: any | null;
    background_color?: 'default' | 'accent' | 'muted' | null;
  };
}

export default function CallToAction({ data }: CallToActionProps) {
  const { id, headline, tagline, content, button_group, background_color = 'accent' } = data;
  const bgClass =
    background_color === 'accent'
      ? 'bg-accent text-white'
      : background_color === 'muted'
        ? 'bg-background-muted'
        : 'bg-background';

  return (
    <section className={`py-20 md:py-28 ${bgClass}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-16 text-center">
        {tagline && (
          <p
            className={`text-sm font-semibold uppercase tracking-wider mb-2 ${background_color === 'accent' ? 'text-white/90' : 'text-accent'}`}
            data-directus={setAttr({
              collection: 'block_call_to_action',
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
            className="mb-6 !text-3xl md:!text-5xl"
            data-directus={setAttr({
              collection: 'block_call_to_action',
              item: id,
              fields: 'headline',
              mode: 'popover',
            })}
          />
        )}

        {content && (
          <BaseText
            content={content}
            className={`text-lg mb-8 ${background_color === 'accent' ? 'text-white/80' : 'text-muted-foreground'}`}
            data-directus={setAttr({
              collection: 'block_call_to_action',
              item: id,
              fields: 'content',
              mode: 'drawer',
            })}
          />
        )}

        {button_group && (
          <div className="flex justify-center">
            <ButtonGroup {...button_group} />
          </div>
        )}
      </div>
    </section>
  );
}

