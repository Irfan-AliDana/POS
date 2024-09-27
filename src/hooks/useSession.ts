import { useQuery } from "@tanstack/react-query";
import { customFetch } from "../utils/lib";

export const useSession = () => {
    const { data: session, isFetched: sessionIsFetched } = useQuery({
        queryKey: ["session"],
        queryFn: () => customFetch("/api/get-session"),
    });

    return { session, sessionIsFetched };
};
