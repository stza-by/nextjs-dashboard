import { useState } from "react";

export default function useDefault<TStateType>(
    defaultValue: TStateType,
    initialValue: TStateType | (() => TStateType),
) {
    const [value, setValue] = useState(initialValue);

    return [value ?? defaultValue, setValue];
}
