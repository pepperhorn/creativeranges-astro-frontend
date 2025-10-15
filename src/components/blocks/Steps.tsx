'use client';

import { setAttr } from '@directus/visual-editing';
import Headline from '@/components/ui/Headline';
import BaseText from '@/components/ui/Text';
import DirectusImage from '@/components/shared/DirectusImage';

interface StepItem {
  id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
}

interface StepsProps {
  data: {
    id: string;
    headline?: string | null;
    tagline?: string | null;
    description?: string | null;
    steps_items?: StepItem[];
  };
}

export default function Steps({ data }: StepsProps) {
  const { id, headline, tagline, description, steps_items = [] } = data;
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        {/* Header */}
        {(headline || tagline || description) && (
          <div className="max-w-3xl mx-auto text-center mb-16">
            {tagline && (
              <p
                className="text-sm font-semibold uppercase tracking-wider text-accent mb-2"
                data-directus={setAttr({
                  collection: 'block_steps',
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
                  collection: 'block_steps',
                  item: id,
                  fields: 'headline',
                  mode: 'popover',
                })}
              />
            )}
            {description && (
              <BaseText
                content={description}
                className="text-lg text-muted-foreground"
                data-directus={setAttr({
                  collection: 'block_steps',
                  item: id,
                  fields: 'description',
                  mode: 'popover',
                })}
              />
            )}
          </div>
        )}

        {/* Steps */}
        <div className="space-y-12">
          {steps_items.map((step, index) => (
            <div
              key={step.id}
              className="relative flex flex-col md:flex-row gap-8 items-start"
              data-directus={setAttr({
                collection: 'block_steps_items',
                item: step.id,
                fields: ['title', 'description', 'icon', 'image'],
                mode: 'modal',
              })}
            >
              {/* Step Number/Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  {step.icon ? (
                    <div dangerouslySetInnerHTML={{ __html: step.icon }} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                {step.description && <BaseText content={step.description} className="text-muted-foreground mb-4" />}

                {/* Optional Image */}
                {step.image && (
                  <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-md">
                    <DirectusImage
                      uuid={step.image}
                      alt={step.title}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                    />
                  </div>
                )}
              </div>

              {/* Connector Line (not on last step) */}
              {index < steps_items.length - 1 && (
                <div className="hidden md:block absolute left-8 top-20 w-0.5 h-full bg-accent/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

