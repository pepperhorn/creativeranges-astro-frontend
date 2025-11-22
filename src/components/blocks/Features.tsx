'use client';

import { setAttr } from '@directus/visual-editing';
import Headline from '@/components/ui/Headline';
import BaseText from '@/components/ui/Text';

interface FeatureItem {
  id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
}

interface FeaturesProps {
  data: {
    id: string;
    headline?: string | null;
    tagline?: string | null;
    description?: string | null;
    icon_color?: string | null;
    features_items?: FeatureItem[];
  };
}

export default function Features({ data }: FeaturesProps) {
  const { id, headline, tagline, description, icon_color, features_items = [] } = data;
  return (
    <section className="block-features py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        {/* Header */}
        {(headline || tagline || description) && (
          <div className="max-w-3xl mx-auto text-center mb-12">
            {tagline && (
              <p
                className="text-sm font-semibold uppercase tracking-wider text-accent mb-2"
                data-directus={setAttr({
                  collection: 'block_features',
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
                  collection: 'block_features',
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
                  collection: 'block_features',
                  item: id,
                  fields: 'description',
                  mode: 'popover',
                })}
              />
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features_items.map((feature) => (
            <div
              key={feature.id}
              className="relative p-6 rounded-lg bg-background-muted hover:shadow-lg transition-shadow duration-300"
              data-directus={setAttr({
                collection: 'block_features_items',
                item: feature.id,
                fields: ['title', 'description', 'icon'],
                mode: 'modal',
              })}
            >
              <div className="flex items-start gap-4">
                         {/* Icon */}
                         {feature.icon && (
                           <div className="flex-shrink-0">
                             <div
                               className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
                               style={{ backgroundColor: icon_color || 'var(--accent-color)' }}
                               dangerouslySetInnerHTML={{ __html: feature.icon }}
                             />
                           </div>
                         )}

                {/* Content */}
                <div className="flex-1">
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>

                  {/* Description */}
                  {feature.description && (
                    <BaseText content={feature.description} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

