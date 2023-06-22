import { LeagueOfLegendsData } from "./leagueOflegends";
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import https from 'https';

export class ApiService {
    private data: LeagueOfLegendsData;
    private api: AxiosInstance;

    constructor(data: LeagueOfLegendsData) {
        this.data = data;
        this.api = axios.create({
            baseURL: `https://127.0.0.1:${data.port}`,
            headers: this.generateHeaders(),
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        })
    }

    private generateHeaders(): Record<string, string> {
        const auth = Buffer.from(`${this.data.username}:${this.data.password}`).toString('base64');

        return {
            Accept: 'application/json',
            Authorization: `Basic ${auth}`
        };
    }

    public async getMe(): Promise<any> {
        const endpoint = '/lol-chat/v1/me';
        const maxRetries = 10;
        let retries = 0;
        while (retries < maxRetries) {
            try {
                const response: AxiosResponse<any> = await this.api.get(endpoint);
                const responseData = response.data;

                //Check if the required data is present in the response
                if (isDataValid(responseData)) {
                    responseData.status = 'logged-in';
                    return responseData
                } else {
                    console.log('Required data not found. Retrying...')
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    retries++;
                }
            } catch (error: any) {
                if (isConnectionRefusedError(error)){ 
                    console.log('Connection refused. Retrying...');
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    retries++;
                } else {
                    throw new Error(`Failed to get me: ${error}`)
                }
            }
        }
        throw new Error('Failed to get me: Maximum retries exceeded');
    }

    



    // // Get Example
    // public async getUser(): Promise<any> {
    //     const endpoint = '/user';
    //     try {
    //         const response: AxiosResponse<any> = await this.api.get(endpoint);
    //         return response.data;
    //     } catch (error) {
    //         throw new Error(`Failed to get user: ${error}`);
    //     }
    // }

    // // Post Example

    // public async createPost(payload: any): Promise<any> {
    //     const endpoint = 'posts';
    //     try {
    //         const response: AxiosResponse<any> = await this.api.post(endpoint, payload);
    //         return response.data;
    //     } catch (error) {
    //         throw new Error(`Failed to create post ${error}`)
    //     }
    // }
}

function isConnectionRefusedError(error: AxiosError) {
    return error.code === 'ECONNREFUSED';
}
function isDataValid(data: any) {
    // Check if the required data is present in the response
    // Return true if the data is valid, otherwise return false
    // Modify this function according to your specific data validation logic
    return (
        data &&
        data.name !== undefined &&
        data.name !== null &&
        data.name !== '' &&
        data.platformId !== undefined &&
        data.platformId !== null &&
        data.platformId !== ''
    );
}