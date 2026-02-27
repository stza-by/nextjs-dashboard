import { useState, Dispatch, SetStateAction } from "react";

type UseCounterReturn = {
    count: number;
    increment: VoidFunction;
    decrement: VoidFunction;
    reset: VoidFunction;
    setCount: Dispatch<SetStateAction<number>>;
};

const useCounter = (initialValue?: number): UseCounterReturn => {
    const [count, setCount] = useState<number>(initialValue ?? 0);

    return {
        count,
        increment: () => setCount((count) => count + 1),
        decrement: () => setCount((count) => count - 1),
        reset: () => setCount(initialValue ?? 0),
        setCount,
    };
};
