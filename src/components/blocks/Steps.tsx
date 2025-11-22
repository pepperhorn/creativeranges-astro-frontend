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
    <div className="block-steps space-y-16">
      {/* Header */}
      {(headline || tagline || description) && (
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {tagline && (
            <p
              className="text-sm font-semibold uppercase tracking-wider text-accent"
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
      <div className="space-y-16">
          {steps_items.map((step, index) => {
            return (
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

                {/* Content with Image */}
                <div className="flex-grow">
                  <div className={`grid grid-cols-1 ${step.image ? 'lg:grid-cols-2' : ''} gap-8 items-start`}>
                    {/* Text Content */}
                    <div>
                      <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                      {step.description && (
                        <BaseText content={step.description} className="text-muted-foreground mb-4" />
                      )}
                    </div>

                    {/* Optional Image */}
                    {step.image && (
                      <div>
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                          <DirectusImage
                            uuid={step.image}
                            alt={step.title}
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector Line (not on last step) */}
                {index < steps_items.length - 1 && (
                  <div className="hidden md:block absolute left-8 top-20 w-0.5 h-full bg-accent/20" />
                )}
              </div>
            );
          })}
        </div>
    </div>
  );
}

