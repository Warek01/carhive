import { ReactNode } from 'react';

export interface PageProps<T = {}> {
   params: Promise<T>;
   searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface LayoutProps<T = {}> {
   children: ReactNode;
   params: Promise<T>;
}
