{/*
----- Iteration 10: Bonus Feature: Motivational Quote of the Day -----
This hook fetches a motivational quote from an API and returns it.
I learned how to implement this using the following online resources:
- ZenQuotes.io, API Documentation, Available at:
https://docs.zenquotes.io/zenquotes-documentation/

-React Native API call, Code Step by Step, Available at:
https://www.youtube.com/watch?v=NuKQk7nbk0k

- Build Quote Generator App in React Native, Pradip Debnath Available at::
https://www.youtube.com/watch?v=OV0qnHInNw0

*/}

import { useEffect, useState } from 'react';

type Quote = {
    text: string;
    author: string;
};

// fetching a random quote from ZenQuotes API
// caching it in memory to only fetch once per app session
let cachedQuote: Quote | null = null;

export function useQuote() {
    const [quote, setQuote] = useState<Quote | null>(cachedQuote);
    const [loading, setLoading] = useState(!cachedQuote);

    useEffect(() => {
        // if already cached this session, skip fetching
        if (cachedQuote) return;

        fetch('https://zenquotes.io/api/today')
            .then((res) => res.json())
            .then((data) => {
                if (data && data.length > 0) {
                    const q = { text: data[0].q, author: data[0].a };
                    cachedQuote = q; // cache for this session
                    setQuote(q);
                }
            })
            .catch(() => {
                // if quote is unreachable, set a default/fallback quote
                const fallback = { text: 'Small steps every day lead to big changes.', author: 'Unknown' };
                setQuote(fallback);
            })
            .finally(() => setLoading(false));
    }, []);

    return { quote, loading };
}
