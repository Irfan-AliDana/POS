import { fetcher } from "../utils/lib";
import useSWR from "swr";

export const useSession = () => {
    const { data: session, isValidating } = useSWR("/api/get-session", (key) =>
        fetcher(key)
    );

    const sessionIsFetched = !isValidating && session !== undefined;

    return { session, sessionIsFetched };
};
