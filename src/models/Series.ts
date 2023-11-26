export interface Series {
    title: string;
    posts: { title: string; url: string; sortOrder: number; isCurrent: boolean; }[];
}