/* tslint: disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v7.7.6173.30627 (NJsonSchema v5.19.6171.28316) (http://NSwag.org)
// </auto-generated>
//----------------------

import 'rxjs/Rx'; 
import {Observable} from 'rxjs/Observable';
import {Injectable, Inject, Optional, OpaqueToken} from '@angular/core';
import {Http, Headers, Response, RequestOptionsArgs} from '@angular/http';

export const API_BASE_URL = new OpaqueToken('API_BASE_URL');

export interface IVegerun2Client {
    /**
     * @return Success
     */
    apiV2MenusByRestaurantIdGet(restaurantId: string): Observable<CustomerMenuResultV2>;
    /**
     * @return Success
     */
    apiV2RestaurantsByIdGet(id: string): Observable<RestaurantResultV2>;
    /**
     * @return Success
     */
    apiV2RestaurantsByTownSlugByRestaurantSlugGet(townSlug: string, restaurantSlug: string): Observable<RestaurantResultV2>;
}

@Injectable()
export class Vegerun2Client implements IVegerun2Client {
    private http: Http = null; 
    private baseUrl: string = undefined; 
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(Http) http: Http, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http; 
        this.baseUrl = baseUrl ? baseUrl : ""; 
    }

    /**
     * @return Success
     */
    apiV2MenusByRestaurantIdGet(restaurantId: string): Observable<CustomerMenuResultV2> {
        let url_ = this.baseUrl + "/api/v2/menus/{restaurantId}"; 
        if (restaurantId === undefined || restaurantId === null)
            throw new Error("The parameter 'restaurantId' must be defined.");
        url_ = url_.replace("{restaurantId}", encodeURIComponent("" + restaurantId));

        const content_ = "";
        
        return this.http.request(url_, {
            body: content_,
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processApiV2MenusByRestaurantIdGet(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processApiV2MenusByRestaurantIdGet(response));
                } catch (e) {
                    return <Observable<CustomerMenuResultV2>><any>Observable.throw(e);
                }
            } else
                return <Observable<CustomerMenuResultV2>><any>Observable.throw(response);
        });
    }

    private processApiV2MenusByRestaurantIdGet(response: Response) {
        const data = response.text();
        const status = response.status.toString(); 

        if (status === "200") {
            let result200: CustomerMenuResultV2 = null; 
            result200 = data === "" ? null : <CustomerMenuResultV2>JSON.parse(data, this.jsonParseReviver);
            return result200; 
        }
        else
        {
            throw new Error("error_no_callback_for_the_received_http_status"); 
        }
    }

    /**
     * @return Success
     */
    apiV2RestaurantsByIdGet(id: string): Observable<RestaurantResultV2> {
        let url_ = this.baseUrl + "/api/v2/restaurants/{id}"; 
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));

        const content_ = "";
        
        return this.http.request(url_, {
            body: content_,
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processApiV2RestaurantsByIdGet(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processApiV2RestaurantsByIdGet(response));
                } catch (e) {
                    return <Observable<RestaurantResultV2>><any>Observable.throw(e);
                }
            } else
                return <Observable<RestaurantResultV2>><any>Observable.throw(response);
        });
    }

    private processApiV2RestaurantsByIdGet(response: Response) {
        const data = response.text();
        const status = response.status.toString(); 

        if (status === "200") {
            let result200: RestaurantResultV2 = null; 
            result200 = data === "" ? null : <RestaurantResultV2>JSON.parse(data, this.jsonParseReviver);
            return result200; 
        }
        else
        {
            throw new Error("error_no_callback_for_the_received_http_status"); 
        }
    }

    /**
     * @return Success
     */
    apiV2RestaurantsByTownSlugByRestaurantSlugGet(townSlug: string, restaurantSlug: string): Observable<RestaurantResultV2> {
        let url_ = this.baseUrl + "/api/v2/restaurants/{townSlug}/{restaurantSlug}"; 
        if (townSlug === undefined || townSlug === null)
            throw new Error("The parameter 'townSlug' must be defined.");
        url_ = url_.replace("{townSlug}", encodeURIComponent("" + townSlug)); 
        if (restaurantSlug === undefined || restaurantSlug === null)
            throw new Error("The parameter 'restaurantSlug' must be defined.");
        url_ = url_.replace("{restaurantSlug}", encodeURIComponent("" + restaurantSlug));

        const content_ = "";
        
        return this.http.request(url_, {
            body: content_,
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processApiV2RestaurantsByTownSlugByRestaurantSlugGet(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processApiV2RestaurantsByTownSlugByRestaurantSlugGet(response));
                } catch (e) {
                    return <Observable<RestaurantResultV2>><any>Observable.throw(e);
                }
            } else
                return <Observable<RestaurantResultV2>><any>Observable.throw(response);
        });
    }

    private processApiV2RestaurantsByTownSlugByRestaurantSlugGet(response: Response) {
        const data = response.text();
        const status = response.status.toString(); 

        if (status === "200") {
            let result200: RestaurantResultV2 = null; 
            result200 = data === "" ? null : <RestaurantResultV2>JSON.parse(data, this.jsonParseReviver);
            return result200; 
        }
        else
        {
            throw new Error("error_no_callback_for_the_received_http_status"); 
        }
    }
}

export interface CustomerMenuResultV2 {
    restaurantId?: string;
    sections?: CustomerMenuSectionResultV2[];
    featuredItems?: CustomerMenuItemResultV2[];
}

export interface CustomerMenuSectionResultV2 {
    name?: string;
    description?: string;
    items?: CustomerMenuItemResultV2[];
}

export interface CustomerMenuItemResultV2 {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    isEnabled?: boolean;
    options?: CustomerMenuOptionResultV2[];
}

export interface CustomerMenuOptionResultV2 {
    id?: string;
    name?: string;
    description?: string;
    selectionMode?: CustomerMenuOptionResultV2SelectionMode;
    minimumSelections?: number;
    maximumSelections?: number;
    values?: MenuOptionValueResult[];
}

export interface MenuOptionValueResult {
    id?: string;
    optionId?: string;
    name?: string;
    price?: number;
    shortCode?: string;
    defaultIsSelected?: boolean;
}

export interface RestaurantResultV2 {
    id?: string;
    name?: string;
    branch?: string;
    phoneNumber?: string;
    address?: PostalAddressResult;
}

export interface PostalAddressResult {
    format?: string;
    id?: string;
    company?: string;
    line1?: string;
    line2?: string;
    postcode?: string;
    latitude?: number;
    longitude?: number;
    instructions?: string;
    nearestLandmark?: string;
}

export enum CustomerMenuOptionResultV2SelectionMode {
    Single = <any>"Single", 
    Multiple = <any>"Multiple", 
}