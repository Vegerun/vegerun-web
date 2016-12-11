import { AuthModel } from '../../../_lib/vegerun';

export interface AuthState extends AuthModel { 
    email?: string;

    loading?: boolean;

    sessionTimestamp?: number;
}

export const DEFAULT_AUTH_STATE: AuthState = {
    accessToken: null,

    expiresIn: null,

    firebaseAccessToken: null,

    loading: false,

    sessionTimestamp: null
}