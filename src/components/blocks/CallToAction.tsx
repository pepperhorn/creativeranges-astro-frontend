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
      ? 'bg-accent'
      : background_color === 'muted'
        ? 'bg-background-muted'
        : 'bg-background';

  return (
    <section className={`block-call-to-action py-20 md:py-28 ${bgClass}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="mx-auto text-center bg-white dark:bg-background dark:border dark:border-slate-600 dark:shadow-none max-w-3xl p-6 rounded-md shadow-xl">
        {tagline && (
          <p
            className="text-sm font-semibold uppercase tracking-wider mb-2 text-accent"
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
            className="text-lg mb-8 text-muted-foreground"
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
            <ButtonGroup data={button_group} />
          </div>
        )}
        </div>
      </div>
    </section>
  );
}

