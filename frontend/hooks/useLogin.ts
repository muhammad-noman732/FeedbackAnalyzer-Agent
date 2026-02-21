import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { UserLogin } from "@/types/auth";
interface UseLoginReturn {
    login: (data: UserLogin) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export function useLogin(): UseLoginReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login: contextLogin } = useAuth();
    const login = async (data: UserLogin) => {
        setIsLoading(true);
        setError(null);
        try {
            await contextLogin(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred during login";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };
    return { login, isLoading, error };
}
