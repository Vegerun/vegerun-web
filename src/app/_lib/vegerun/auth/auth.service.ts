import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../';

import { AuthModel } from './models/auth.model';

@Injectable()
export class AuthService {

    constructor(
        private http: Http,
        @Inject(API_BASE_URL) private baseUrl: string 
    ) { }

    login(email: string, password: string): Observable<AuthModel> {
        return this.http.post(this.baseUrl + '/api/token', { email, password })
            .map<AuthData>(res => res.json())
            .map<AuthModel>(data => ({
                accessToken: data.access_token,
                expiresIn: data.expires_in,
                firebaseAccessToken: data.firebase_access_token,
                restaurantId: data.restaurant_id
            }))
            .cache()
    }

    logout(): Observable<{}> {
        // TODO: Implement me
        return Observable.empty();
    }
}

interface AuthData {
    access_token: string;

    expires_in: number;

    restaurant_id: string;

    firebase_access_token: string;
}