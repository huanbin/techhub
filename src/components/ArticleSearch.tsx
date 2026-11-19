import { useState } from "react";

interface Category {
    name: string;
    slug: string;
}

interface Tag {
    name: string;
    slug: string;
}

interface Article {
    id: string;
    title: string;
    description: string;
    category: Category;
    tags: Tag[];
}

interface Props {
    articles: Article[];
}

export default function ArticleSearch({ articles }: Props) {
    /*
     * =========================
     * State
     * =========================
     */

    const [query, setQuery] = useState("");

    const [category, setCategory] = useState("all");

    const [tag, setTag] = useState("all");

    /*
     * =========================
     * 从文章数据中提取分类
     * =========================
     */

    const categories = Array.from(
        new Map(
            articles.map((article) => [
                article.category.slug,
                article.category,
            ])
        ).values()
    );

    /*
     * =========================
     * 从文章数据中提取标签
     * =========================
     */

    const tags = Array.from(
        new Map(
            articles
                .flatMap((article) => article.tags)
                .map((tag) => [tag.slug, tag])
        ).values()
    );

    /*
     * =========================
     * 标准化搜索关键词
     * =========================
     */

    const normalizedQuery = query.trim().toLowerCase();

    /*
     * =========================
     * 派生数据
     * =========================
     */

    const filteredArticles = articles.filter((article) => {
        /*
         * 1. 关键词匹配
         */

        const matchesQuery =
            !normalizedQuery ||
            [
                article.title,
                article.description,
                article.category.name,
                ...article.tags.map((tag) => tag.name),
            ]
                .join(" ")
                .toLowerCase()
                .includes(normalizedQuery);

        /*
         * 2. 分类匹配
         */

        const matchesCategory =
            category === "all" ||
            article.category.slug === category;

        /*
         * 3. 标签匹配
         */

        const matchesTag =
            tag === "all" ||
            article.tags.some(
                (articleTag) => articleTag.slug === tag
            );

        /*
         * 三个条件必须同时满足
         */

        return (
            matchesQuery &&
            matchesCategory &&
            matchesTag
        );
    });

    /*
     * =========================
     * UI
     * =========================
     */

    return (
        <section>
            {/* 关键词搜索 */}

            <div>
                <input
                    type="search"
                    placeholder="搜索文章..."
                    value={query}
                    onChange={(event) =>
                        setQuery(event.target.value)
                    }
                />
            </div>

            {/* 分类 */}

            <div>
                <label htmlFor="category">
                    分类：
                </label>

                <select
                    id="category"
                    value={category}
                    onChange={(event) =>
                        setCategory(event.target.value)
                    }
                >
                    <option value="all">
                        全部分类
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category.slug}
                            value={category.slug}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 标签 */}

            <div>
                <label htmlFor="tag">
                    标签：
                </label>

                <select
                    id="tag"
                    value={tag}
                    onChange={(event) =>
                        setTag(event.target.value)
                    }
                >
                    <option value="all">
                        全部标签
                    </option>

                    {tags.map((tag) => (
                        <option
                            key={tag.slug}
                            value={tag.slug}
                        >
                            {tag.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 结果数量 */}

            <p>
                找到 {filteredArticles.length} 篇文章
            </p>

            {/* 文章列表 */}

            <div>
                {filteredArticles.map((article) => (
                    <article key={article.id}>
                        <h2>
                            <a href={`/blog/${article.id}`}>
                                {article.title}
                            </a>
                        </h2>

                        <p>
                            {article.description}
                        </p>

                        <div>
                            <span>
                                {article.category.name}
                            </span>

                            {article.tags.map((tag) => (
                                <span key={tag.slug}>
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    </article>
                ))}
            </div>

            {/* 无结果 */}

            {filteredArticles.length === 0 && (
                <p>
                    没有找到相关文章。
                </p>
            )}
        </section>
    );
}