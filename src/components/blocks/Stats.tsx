'use client';

import { setAttr } from '@directus/visual-editing';
import Headline from '@/components/ui/Headline';

interface StatItem {
  id: string;
  number: string;
  label: string;
  description?: string | null;
}

interface StatsProps {
  data: {
    id: string;
    headline?: string | null;
    tagline?: string | null;
    background_color?: 'default' | 'dark' | null;
    stats_items?: StatItem[];
  };
}

export default function Stats({ data }: StatsProps) {
  const { id, headline, tagline, background_color = 'default', stats_items = [] } = data;
  
  const bgClass = background_color === 'dark' ? 'bg-gray dark:bg-[var(--background-variant-color)]' : '';
  
  return (
    <section className={`block-stats py-16 md:py-20 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        {/* Header */}
        {(headline || tagline) && (
          <div className="max-w-3xl mx-auto text-center mb-12">
            {tagline && (
              <p
                className="text-sm font-semibold uppercase tracking-wider text-accent mb-2"
                data-directus={setAttr({
                  collection: 'block_stats',
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
                  collection: 'block_stats',
                  item: id,
                  fields: 'headline',
                  mode: 'popover',
                })}
              />
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats_items.map((stat) => (
            <div
              key={stat.id}
              className="text-center"
              data-directus={setAttr({
                collection: 'block_stats_items',
                item: stat.id,
                fields: ['number', 'label', 'description'],
                mode: 'popover',
              })}
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.number}</div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              {stat.description && <div className="text-sm text-muted-foreground">{stat.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

