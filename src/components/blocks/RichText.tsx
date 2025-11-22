import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';
import Text from '@/components/ui/Text';
import { setAttr } from '@directus/visual-editing';

interface RichTextProps {
  data: {
    id: string;
    tagline?: string;
    headline?: string;
    content?: string;
    alignment?: 'left' | 'center' | 'right';
    width?: 'tight' | 'full';
    background?: boolean;
  };
  className?: string;
}

const RichText = ({ data, className }: RichTextProps) => {
  const { id, tagline, headline, content, alignment = 'left', width = 'full', background = false } = data;
  
  // When background is true, remove horizontal margins/padding so background extends to edges
  // When background is false, apply normal width constraints
  const widthClasses = background 
    ? '' 
    : (width === 'full' ? 'px-5' : 'max-w-[80vw]');

  // Determine background styling
  // When background is true, add padding for content but let background extend full width
  const backgroundClasses = background 
    ? 'bg-blue text-white not-prose py-4 px-4 sm:px-6'
    : '';

  // Determine alignment classes
  const alignmentClass = alignment === 'center' 
    ? 'text-center' 
    : alignment === 'right' 
      ? 'text-right' 
      : 'text-left';

  // Add text color for background mode
  const textColorClass = background ? 'text-white' : '';

  return (
    <div className={`block-richtext mx-auto w-full ${widthClasses} ${backgroundClasses} space-y-8 ${className}`}>
      {tagline && (
        <Tagline
          tagline={tagline}
          className={`${alignmentClass} ${textColorClass}`}
          data-directus={setAttr({
            collection: 'block_richtext',
            item: id,
            fields: 'tagline',
            mode: 'popover',
          })}
        />
      )}
      {headline && (
        <Headline
          headline={headline}
          className={`${alignmentClass} ${textColorClass}`}
          data-directus={setAttr({
            collection: 'block_richtext',
            item: id,
            fields: 'headline',
            mode: 'popover',
          })}
        />
      )}
      {content && (
        <div 
          className={`max-w-none text-lg leading-relaxed [&_h1]:text-center [&_h1]:text-4xl [&_h2]:text-center [&_h2]:text-3xl [&_h3]:text-center [&_h3]:text-2xl [&_h3]:mb-6 [&_h4]:text-center [&_h4]:text-xl [&_h5]:text-center [&_h5]:text-lg [&_h6]:text-center [&_h6]:text-base [&_img]:block [&_img]:max-w-full [&_img]:h-auto [&_p]:max-w-none [&_p]:leading-relaxed [&_p]:mb-6 ${
            alignment === 'center' 
              ? '[&_p]:text-center [&_img]:mx-auto' 
              : alignment === 'right' 
                ? '[&_p]:text-right [&_img]:ml-auto'
                : '[&_p]:text-left [&_img]:mr-auto'
          }`}
          dangerouslySetInnerHTML={{ __html: content }}
          data-directus={setAttr({
            collection: 'block_richtext',
            item: id,
            fields: 'content',
            mode: 'drawer',
          })}
        />
      )}
    </div>
  );
};

export default RichText;
