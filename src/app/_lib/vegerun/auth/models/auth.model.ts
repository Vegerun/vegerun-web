export interface AuthModel {
    accessToken: string;

    expiresIn: number;

    firebaseAccessToken: string;

    restaurantId?: string;
}