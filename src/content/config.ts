import { z, defineCollection } from 'astro:content';

const BlogPostCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        date: z.string().transform(str => new Date(str)),
        tags: z.array(z.string()),
        commentIssueNumber: z.number().optional(),
        urlSlug: z.string().optional(),
        isRssOnly: z.boolean().optional().default(false),
        excerpt: z.string().optional(),
        description: z.string().optional(),
        relatedPosts: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
    }),
});

const ReadingLogCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        date: z.string().transform(str => new Date(str)),
        tags: z.array(z.string()),
        commentIssueNumber: z.number().optional(),
        excerpt: z.string().optional(),
        description: z.string().optional(),
        id: z.number(),
    }),
});

const BookNotesCollection = defineCollection({
    schema: z.object({
        urlSlug: z.string(),
        title: z.string(),
        dateFinished: z.string().transform(str => new Date(str)),
        author: z.string(),
        categories: z.array(z.string()),
        links: z.array(z.object({ title: z.string(), url: z.string() })),
        rating: z.number(),
        coverImage: z.string(),
        commentIssueNumber: z.number().optional(),
    }),
});

export const collections = {
    'blog': BlogPostCollection,
    'readinglogs': ReadingLogCollection,
    'booknotes': BookNotesCollection,
};
