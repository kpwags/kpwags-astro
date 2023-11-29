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

export const collections = {
    'blog': BlogPostCollection,
};
