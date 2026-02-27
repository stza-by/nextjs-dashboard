type JobDetails = {
    id: number;
    by: string;
    score: 1;
    time: number;
    type: string;
    title: string;
    url: string;
};

export const fetchListOfJobIds = async (): Promise<number[]> => {
    const res = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json",
    );

    return res.json();
};

export const getJobDetailsByID = async (id: number): Promise<JobDetails> => {
    const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
    );

    return res.json();
};
