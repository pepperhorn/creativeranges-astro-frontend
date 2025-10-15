import React from 'react';
import Form from './Form';
import Gallery from './Gallery';
import Posts from './Posts';
import Hero from './Hero';
import RichText from './RichText';
import Pricing from './Pricing';
import Features from './Features';
import Content from './Content';
import Steps from './Steps';
import Stats from './Stats';
import CallToAction from './CallToAction';
import type { PageBlock } from '@/types/directus-schema';

interface BaseBlockProps {
  block: PageBlock;
}

export default function BaseBlock({ block }: BaseBlockProps) {
  if (!block.collection || !block.item) return null;

  const components: Record<string, React.ElementType> = {
    block_hero: Hero,
    block_gallery: Gallery,
    block_posts: Posts,
    block_form: Form,
    block_richtext: RichText,
    block_pricing: Pricing,
    block_features: Features,
    block_content: Content,
    block_steps: Steps,
    block_stats: Stats,
    block_call_to_action: CallToAction,
  };

  const Component = components[block.collection];

  const itemId =
    typeof block.item === 'object' && block.item !== null && 'id' in block.item ? (block.item.id as string) : undefined;

  return Component ? <Component data={block.item} blockId={block.id} itemId={itemId} /> : null;
}
