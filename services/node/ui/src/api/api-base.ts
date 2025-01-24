import axios, { AxiosInstance } from 'axios';

export abstract class ApiBase {
   protected abstract readonly BASE_PATH: string;
   protected readonly axios: AxiosInstance;

   private readonly BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

   constructor(private readonly token?: string) {
      this.axios = axios.create({
         baseURL: this.BASE_URL,
         headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
         },
      });
   }

   protected async get<T>(path: string): Promise<T> {
      const res = await this.axios.get(`${this.BASE_PATH}/${path}`);
      return res.data;
   }

   protected async post<T>(path: string, data: any): Promise<T> {
      const res = await this.axios.post(`${this.BASE_PATH}/${path}`, data);
      return res.data;
   }

   protected async patch<T>(path: string, data: any): Promise<T> {
      const res = await this.axios.patch(`${this.BASE_PATH}/${path}`, data);
      return res.data;
   }

   protected async delete<T>(path: string): Promise<T> {
      const res = await this.axios.delete(`${this.BASE_PATH}/${path}`);
      return res.data;
   }
}
