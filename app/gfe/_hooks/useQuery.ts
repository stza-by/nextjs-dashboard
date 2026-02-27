import { DependencyList, useEffect, useState } from "react";

type AsyncState<T> =
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: Error };

export default function useQuery<T>(
    fn: () => Promise<T>,
    deps: DependencyList = [],
): AsyncState<T> {
    const [queryState, setQueryState] = useState<AsyncState<T>>({
        status: "loading",
    });

    useEffect(() => {
        setQueryState({ status: "loading" });

        const abortController = new AbortController();

        fn()
            .then((data) => {
                if (!abortController.signal.aborted) {
                    setQueryState({ status: "success", data });
                }
            })
            .catch((error) => {
                if (!abortController.signal.aborted) {
                    setQueryState({ status: "error", error });
                }
            });

        return () => {
            abortController.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);

    return queryState;
}
