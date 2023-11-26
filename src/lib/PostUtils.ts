import type { CombinedPost } from '@models/CombinedPost';
import markdown from '@lib/drawdown';
import { getCollection, type CollectionEntry } from 'astro:content';

export const getPublicPosts = async (): Promise<CollectionEntry<'blog'>[]> => {
    const posts = await getCollection('blog');

    return posts.filter((p) => !p.data.isRssOnly);
}

export const calculateReadingTime = (content: string): number => {
    const wordCount = content.split(' ').length - 1;
    let readingTime = Math.round(wordCount / 200);

    if (readingTime === 0) {
        readingTime = 1;
    }

    return readingTime;
}

const generateSlug = (tag: string): string => tag
    .toLowerCase()
    .replace(/\s/g, '-')
    .replaceAll('.', '')
    .replaceAll("'", '')
    .replaceAll('?', '');

export const generateTagUrl = (tag: string): string => {
    switch (tag.toUpperCase()) {
        case '.NET':
            return 'dotnet';
        case 'C#':
            return 'csharp';
        case 'F#':
            return 'fsharp';
        default:
            return generateSlug(tag);
    }
};

export const sortPosts = (posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] => posts.sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => {
    if (a.data.date < b.data.date) {
        return 1;
    }
    return -1;
});

export const sortAllPosts = (posts: CombinedPost[]): CombinedPost[] => posts.sort((a: CombinedPost, b: CombinedPost) => {
    if (a.date < b.date) {
        return 1;
    }
    return -1;
});

export const getPostExcerpt = (entry: string): string => {
    const paragraphs = entry.split('\n');

    let excerpt = paragraphs.filter((p) => p.trim().length > 0 && !p.trim().startsWith('import'))[0];

    excerpt = markdown(excerpt);

    return excerpt.replace('<p>', '').replace('</p>', '');
};

export const removeAnchorLink = (str: string): string => str.replace(/<a.*?>/ig, '').replace(/<\/a>/ig, '');

export const getPermalink = (post: CollectionEntry<'blog'>, includeRootUrl = false): string => {
    const rootUrl = includeRootUrl ? 'https://kpwags.com' : '';
    const year = post.data.date.getFullYear();
    const month = String(post.data.date.getMonth() + 1).padStart(2, '0');
    const day = String(post.data.date.getDate() + 1).padStart(2, '0');

    return `${rootUrl}/posts/${year}/${month}/${day}/${post.data.urlSlug || post.slug}`
};

export const getPageCount = (posts: any[], perPage: number): number => Math.ceil(posts.length / perPage);

export const getPermalinkDate = (date: Date): { year: string, month: string, day: string } => ({
    year: date.getFullYear().toString(),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate() + 1).padStart(2, '0'),
});