import { useQuery } from "@tanstack/react-query";
import { useFetch } from "./useFetch";

export const useSession = () => {
    const { data: session, isFetched: sessionIsFetched } = useQuery({
        queryKey: ["session"],
        queryFn: () => useFetch("/api/get-session"),
    });

    return { session, sessionIsFetched };
};
