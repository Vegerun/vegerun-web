import { AuthModel } from '../../../_lib/vegerun';

export interface LoginPayload {
    email: string;

    password: string;
}

export interface LoginStartedPayload {
    email: string;

    password: string;
}

export interface LoginCompletedPayload {
    email: string;

    auth: AuthModel;
}

export interface LoginFailedPayload {
    email: string;

    error: any;
}