import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import qs from 'qs';

export abstract class ApiBase {
   protected abstract readonly BASE_PATH: string;
   protected readonly axios: AxiosInstance;

   private readonly BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

   constructor() {
      this.axios = axios.create({
         baseURL: this.BASE_URL,
         withCredentials: true,
         paramsSerializer: (params) => qs.stringify(params),
      });
   }

   protected async get<T>(
      path: string,
      config?: AxiosRequestConfig<any>,
   ): Promise<T> {
      const res = await this.axios.get(`${this.BASE_PATH}/${path}`, config);
      return res.data;
   }

   protected async post<T>(
      path: string,
      data: any,
      config?: AxiosRequestConfig<any>,
   ): Promise<T> {
      const res = await this.axios.post(
         `${this.BASE_PATH}/${path}`,
         data,
         config,
      );
      return res.data;
   }

   protected async patch<T>(
      path: string,
      data: any,
      config?: AxiosRequestConfig<any>,
   ): Promise<T> {
      const res = await this.axios.patch(
         `${this.BASE_PATH}/${path}`,
         data,
         config,
      );
      return res.data;
   }

   protected async delete<T>(
      path: string,
      config?: AxiosRequestConfig<any>,
   ): Promise<T> {
      const res = await this.axios.delete(`${this.BASE_PATH}/${path}`, config);
      return res.data;
   }
}
