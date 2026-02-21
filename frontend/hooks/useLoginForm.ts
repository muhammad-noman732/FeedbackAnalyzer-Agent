'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/useLogin";

export function useLoginForm() {
    const { login, isLoading, error } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        onSubmit,
        isLoading,
        error
    };
}
