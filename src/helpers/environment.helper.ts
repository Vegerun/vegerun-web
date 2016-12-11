export class EnvironmentHelper {

    static get environmentName(): string {
        return ENV;
    }

    static isDevelopment(): boolean {
        return EnvironmentHelper.environmentName === 'development';
    }
}