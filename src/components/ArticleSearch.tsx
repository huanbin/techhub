
import { useEffect, useState } from "react";

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

interface SearchFilters {
    query: string;
    category: string;
    tag: string;
}

// 从 URL 读取筛选条件
function readFiltersFromURL(): SearchFilters {
    const params = new URLSearchParams(window.location.search);

    return {
        query: params.get("q") ?? "",
        category: params.get("category") ?? "all",
        tag: params.get("tag") ?? "all",
    };
}

// 将筛选条件写入 URL
function writeFiltersToURL(filters: SearchFilters) {
    const url = new URL(window.location.href);

    if (filters.query.trim()) {
        url.searchParams.set("q", filters.query.trim());
    } else {
        url.searchParams.delete("q");
    }

    if (filters.category !== "all") {
        url.searchParams.set("category", filters.category);
    } else {
        url.searchParams.delete("category");
    }

    if (filters.tag !== "all") {
        url.searchParams.set("tag", filters.tag);
    } else {
        url.searchParams.delete("tag");
    }
    // 更新当前历史
    window.history.replaceState({}, "", url);
}

export default function ArticleSearch({ articles }: Props) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [tag, setTag] = useState("all");

    // 标记：是否已经从 URL 初始化
    const [urlReady, setUrlReady] = useState(false);

    // 第一次加载：从 URL 恢复筛选条件
    useEffect(() => {
        const filters = readFiltersFromURL();

        setQuery(filters.query);
        setCategory(filters.category);
        setTag(filters.tag);

        setUrlReady(true);
    }, []);

    // 筛选条件变化：同步到 URL
    useEffect(() => {
        if (!urlReady) return;

        writeFiltersToURL({
            query,
            category,
            tag,
        });
    }, [query, category, tag, urlReady]);

    // 处理浏览器前进/后退
    useEffect(() => {
        function handlePopState() {
            const filters = readFiltersFromURL();

            setQuery(filters.query);
            setCategory(filters.category);
            setTag(filters.tag);
        }

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    // 提取当前页面中出现的分类
    const categories = Array.from(
        new Map(
            articles.map((article) => [
                article.category.slug,
                article.category,
            ])
        ).values()
    );

    // 提取当前页面中出现的标签
    const tags = Array.from(
        new Map(
            articles
                .flatMap((article) => article.tags)
                .map((item) => [item.slug, item])
        ).values()
    );

    const normalizedQuery = query.trim().toLowerCase();

    // 根据三个条件筛选文章
    const filteredArticles = articles.filter((article) => {
        const matchesQuery =
            !normalizedQuery ||
            [
                article.title,
                article.description,
                article.category.name,
                ...article.tags.map((item) => item.name),
            ]
                .join(" ")
                .toLowerCase()
                .includes(normalizedQuery);

        const matchesCategory =
            category === "all" ||
            article.category.slug === category;

        const matchesTag =
            tag === "all" ||
            article.tags.some((item) => item.slug === tag);

        return matchesQuery && matchesCategory && matchesTag;
    });

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap gap-3">
                <input
                    type="search"
                    placeholder="搜索文章..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="
            rounded-lg border border-gray-300
            bg-white px-4 py-2
            dark:border-gray-700 dark:bg-gray-900
          "
                />

                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="
            rounded-lg border border-gray-300
            bg-white px-3 py-2
            dark:border-gray-700 dark:bg-gray-900
          "
                >
                    <option value="all">全部分类</option>

                    {categories.map((item) => (
                        <option key={item.slug} value={item.slug}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <select
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                    className="
            rounded-lg border border-gray-300
            bg-white px-3 py-2
            dark:border-gray-700 dark:bg-gray-900
          "
                >
                    <option value="all">全部标签</option>

                    {tags.map((item) => (
                        <option key={item.slug} value={item.slug}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            <p>找到 {filteredArticles.length} 篇文章</p>

            <div className="grid gap-4">
                {filteredArticles.map((article) => (
                    <article
                        key={article.id}
                        className="
              rounded-xl border border-gray-200
              bg-white p-5
              dark:border-gray-800 dark:bg-gray-900
            "
                    >
                        <h2 className="text-xl font-bold">
                            <a href={`/blog/${article.id}`}>
                                {article.title}
                            </a>
                        </h2>

                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {article.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-sm">
                            <span>{article.category.name}</span>

                            {article.tags.map((item) => (
                                <span key={item.slug}>#{item.name}</span>
                            ))}
                        </div>
                    </article>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <p>没有找到相关文章。</p>
            )}
        </section>
    );
}
