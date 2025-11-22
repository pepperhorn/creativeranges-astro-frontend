import type { PageBlock, Page } from '@/types/directus-schema';
import BaseBlock from '@/components/blocks/BaseBlock';
import Container from '@/components/ui/Container';
import { getBackgroundThemeClasses, getCustomColorStyles } from '@/lib/utils/colorOverrides';

interface PageBuilderProps {
  sections: PageBlock[];
  page?: Page | null;
}

const PageBuilder = ({ sections, page }: PageBuilderProps) => {
  const validBlocks = sections.filter(
    (block): block is PageBlock & { collection: string; item: object } =>
      typeof block.collection === 'string' && !!block.item && typeof block.item === 'object',
  );

  return (
    <div>
      {validBlocks.map((block) => (
        <section 
          key={block.id} 
          data-background={block.background} 
          className={getBackgroundThemeClasses(page, block.background)}
          style={getCustomColorStyles(page, block.background)}
        >
          <Container>
            <BaseBlock
              block={{
                collection: block.collection,
                item: block.item,
                id: block.id,
              }}
            />
          </Container>
        </section>
      ))}
    </div>
  );
};

export default PageBuilder;
