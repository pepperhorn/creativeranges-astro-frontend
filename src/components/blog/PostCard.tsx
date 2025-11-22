import DirectusImage from '@/components/shared/DirectusImage';
import type { Post } from '@/types/directus-schema';

interface PostCardProps {
  post: Post;
  className?: string;
}

export default function PostCard({ post, className = '' }: PostCardProps) {
  return (
    <a
      href={`/news/${post.slug}`}
      className={`group block overflow-hidden rounded-lg flex-shrink-0 ${className}`}
      style={{ width: 'min(100%, 320px)' }}
    >
      <div className="relative w-full h-64 rounded-lg overflow-hidden">
        {post.image && (
          <DirectusImage
            uuid={typeof post.image === 'string' ? post.image : post.image?.id}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl group-hover:text-accent font-heading transition-colors duration-300">
          {post.title}
        </h3>
        {post.description && (
          <p className="text-sm text-foreground mt-2 line-clamp-2">{post.description}</p>
        )}
      </div>
    </a>
  );
}


