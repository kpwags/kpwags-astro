import type { CombinedPost } from '@models/CombinedPost';
import markdown from '@lib/drawdown';
import { getCollection, type CollectionEntry } from 'astro:content';
import { formatDate, getDateParts } from './DateUtils';
import type { Archives } from '@models/Archives';

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

export const sortReadingLogs = (posts: CollectionEntry<'readinglogs'>[]): CollectionEntry<'readinglogs'>[] => posts.sort((a: CollectionEntry<'readinglogs'>, b: CollectionEntry<'readinglogs'>) => {
    if (a.data.date < b.data.date) {
        return 1;
    }
    return -1;
});

export const sortBookNotes = (bookNotes: CollectionEntry<'booknotes'>[]): CollectionEntry<'booknotes'>[] => bookNotes.sort((a: CollectionEntry<'booknotes'>, b: CollectionEntry<'booknotes'>) => {
    if (a.data.dateFinished < b.data.dateFinished) {
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

export const combineBlogAndReadingLog = (blogEntries: CollectionEntry<'blog'>[], readingLogs: CollectionEntry<'readinglogs'>[]): CombinedPost[] => {
    return sortAllPosts([
        ...blogEntries.map((post) => ({
            title: post.data.title,
            link: getPermalink(post),
            date: post.data.date,
            tags: post.data.tags,
            excerpt: getPostExcerpt(post.body),
            content: post.body,
        })),
        ...readingLogs.map((log) => ({
            title: log.data.title,
            link: `/reading-log/${log.data.id}`,
            date: log.data.date,
            tags: log.data.tags,
            excerpt: getPostExcerpt(log.body),
            content: log.body,
        })),
    ]);
};

export const getPostYears = (blogEntries: CollectionEntry<'blog'>[], readingLogs: CollectionEntry<'readinglogs'>[]): number[] => {
    const posts = combineBlogAndReadingLog(blogEntries, readingLogs);

    const archiveYears: number[] = [];

    // get unique years
    posts.forEach((post) => {
        const dateParts = getDateParts(post.date);
        const archiveYear = parseInt(dateParts.year, 10);

        archiveYears.push(archiveYear);
    });

    const years: number[] = [...new Set(archiveYears)];

    return years;
};

export const getArchivesList = (blogEntries: CollectionEntry<'blog'>[], readingLogs: CollectionEntry<'readinglogs'>[]): Archives[] => {
    const archives: Archives[] = [];

    const posts = combineBlogAndReadingLog(blogEntries, readingLogs);

    const years: number[] = getPostYears(blogEntries, readingLogs);

    years.forEach((year) => {
        archives.push({ year, items: [] });
    })

    posts.forEach((post) => {
        const monthYear = formatDate(post.date, 'MMMM YYYY');
        const dateParts = getDateParts(post.date);
        const archiveYear = parseInt(dateParts.year, 10);

        const archive = archives.find(a => a.year === archiveYear);

        if (archive) {
            if (archive.items.filter(a => a.monthYear === monthYear).length === 0) {
                archive.items.push({ monthYear, url: `/archives/${dateParts.year}/${dateParts.month}` });
            }
        }
    });

    return archives;
};

export const getYearMonthData = (years: number[]): { year: number; month: number; }[] => {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    const yearMonths: { year: number; month: number; }[] = [];

    years.map((year) => {
        months.map((month) => {
            yearMonths.push({
                year,
                month: parseInt(month, 10),
            })
        });
    });

    return yearMonths;
}