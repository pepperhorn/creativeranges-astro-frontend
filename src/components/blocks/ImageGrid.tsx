import React from 'react';
import type { BlockImageGrid, BlockImageGridItem, DirectusFile } from '@/types/directus-schema';

interface ImageGridProps {
  data: BlockImageGrid;
}

interface ImageGridItemProps {
  item: BlockImageGridItem;
}

const ImageGridItem: React.FC<ImageGridItemProps> = ({ item }) => {
  const image = item.image as DirectusFile | null;
  
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-background-muted shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
      {image && (
        <div className="aspect-square overflow-hidden">
          <img
            src={`${import.meta.env.PUBLIC_DIRECTUS_URL}/assets/${image.id}?width=400&height=400&fit=cover&quality=80`}
            alt={image.description || item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
        {item.description && (
          <div 
            className="text-muted-foreground prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        )}
      </div>
    </div>
  );
};

const ImageGrid: React.FC<ImageGridProps> = ({ data }) => {
  const columns = data.columns || 3;
  
  // Create responsive grid classes based on column count
  const getGridClasses = (cols: number) => {
    switch (cols) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (!data.image_grid_items || data.image_grid_items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        {(data.tagline || data.headline || data.description) && (
          <div className="mx-auto max-w-2xl text-center mb-12">
            {data.tagline && (
              <p className="text-base font-semibold leading-7 text-accent">
                {data.tagline}
              </p>
            )}
            {data.headline && (
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {data.headline}
              </h2>
            )}
            {data.description && (
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {data.description}
              </p>
            )}
          </div>
        )}

        {/* Image Grid */}
        <div className={`grid gap-8 ${getGridClasses(columns)}`}>
          {data.image_grid_items.map((item) => (
            <ImageGridItem 
              key={typeof item === 'string' ? item : item.id} 
              item={typeof item === 'string' ? { id: item, title: '' } : item} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGrid;


