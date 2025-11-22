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
import ImageGrid from './ImageGrid';
import BlogFilteredPosts from './BlogFilteredPosts';
import ButtonGroup from './ButtonGroup';
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
    block_filtered_posts: BlogFilteredPosts,
    block_form: Form,
    block_richtext: RichText,
    block_pricing: Pricing,
    block_features: Features,
    block_content: Content,
    block_steps: Steps,
    block_stats: Stats,
    block_call_to_action: CallToAction,
    block_image_grid: ImageGrid,
    block_button_group: ButtonGroup,
  };

  const Component = components[block.collection];


  const itemId =
    typeof block.item === 'object' && block.item !== null && 'id' in block.item ? (block.item.id as string) : undefined;

  // Only pass data if it's an object (not a string ID)
  if (typeof block.item === 'string') {
    console.warn(`BaseBlock: block.item is still a string for ${block.collection}, expected object`);
    return null;
  }

  return Component ? <Component data={block.item} blockId={block.id} itemId={itemId} /> : null;
}
