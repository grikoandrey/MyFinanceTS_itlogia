export type LogoutType = {
    refreshToken: string | null
}

export type LoginType = {
    email: string,
    password: string,
    rememberMe: boolean,
}

export type SignType = {
    name: string,
    lastName: string,
    email: string,
    password: string,
    passwordRepeat: string,
}