import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2>React Counter</h2>

            <p>点击次数：{count}</p>

            <button onClick={() => setCount(count + 1)}>
                点击 +1
            </button>

            <button onClick={() => setCount(0)}>
                重置
            </button>
        </div>
    );
}