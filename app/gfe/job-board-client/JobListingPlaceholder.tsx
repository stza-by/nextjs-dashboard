export const JobListingPlaceholder = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {Array.from({ length: 6 }).map((_, i) => i)}
        </div>
    );
};
