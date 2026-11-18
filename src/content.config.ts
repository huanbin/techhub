import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
// 读取markdown文件
const blog = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "./src/content/blog",
	}),
	// 定义文章数据的结构，字段的类型
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		category: z.string(),
		tags: z.array(z.string()),
		author: z.string(),
		//草稿
		draft: z.boolean().default(false),
	}),
});
// 注冊集合blog
export const collections = {
	blog,
};
