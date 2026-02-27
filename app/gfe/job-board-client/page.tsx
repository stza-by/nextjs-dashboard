"use client";
import { fetchListOfJobIds } from "@/app/gfe/job-board-client/data";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { JobListingPlaceholder } from "@/app/gfe/job-board-client/JobListingPlaceholder";
import { JobListing } from "@/app/gfe/job-board-client/JobListing";

export default function JobBoardClientPage() {
    const [jobIds, setJobIds] = useState<number[]>();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetchListOfJobIds().then((ids) => {
            setJobIds(ids);
            setLoading(false);
        });
    }, []);

    return (
        <main className={styles.main}>
            <h1>Hacker News Job Board</h1>

            {isLoading && <JobListingPlaceholder />}

            {!isLoading && <JobListing ids={[]} />}
        </main>
    );
}
