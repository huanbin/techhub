import {
    useEffect,
    useState,
} from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    // 同步浏览器中保存的主题状态
    useEffect(() => {
        const savedTheme =
            localStorage.getItem("theme");

        const isDark =
            savedTheme === "dark";

        setDark(isDark);
    }, []);

    function toggleTheme() {
        const nextDark = !dark;

        setDark(nextDark);
        // <html>元素添加或移除dark class
        document.documentElement.classList.toggle(
            "dark",
            nextDark
        );

        localStorage.setItem(
            "theme",
            nextDark ? "dark" : "light"
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={
                dark
                    ? "切换到浅色模式"
                    : "切换到深色模式"
            }
            className="
        rounded-lg
        border
        border-gray-300
        px-3
        py-2
        text-sm
        hover:bg-gray-100
        dark:border-gray-700
        dark:hover:bg-gray-800
      "
        >
            {dark ? "☀️" : "🌙"}
        </button>
    );
}