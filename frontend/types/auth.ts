export interface UserSignup {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserResponse {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface AuthError {
    detail: string;
}
