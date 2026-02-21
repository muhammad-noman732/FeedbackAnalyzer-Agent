import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { SignupFormData } from "@/lib/validations/auth";
interface UseSignupReturn {
    signup: (data: SignupFormData) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export function useSignup(): UseSignupReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signup: contextSignup } = useAuth();
    const signup = async (data: SignupFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const { confirmPassword, ...signupData } = data;
            await contextSignup(signupData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred during signup";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };
    return { signup, isLoading, error };
}
