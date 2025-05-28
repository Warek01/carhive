'use client';

import qs from 'qs';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';

import { appRoute } from '@/config/app-route';
import { useAuth } from '@/hooks/use-auth';

export interface ComparisonContextProps {
   max: number;
   isMax: boolean;
   ids: number[];
   has: (id: number) => boolean;
   add: (id: number) => void;
   remove: (id: number) => number[];
   toggle: (id: number) => void;
   getUrl: (overrideIds?: number[]) => string;
   clear: () => void;
}

export const ComparisonContext = createContext<ComparisonContextProps>(null!);

export function ComparisonContextProvider({ children }: PropsWithChildren) {
   const { isAuthorized } = useAuth();

   const [ids, setIds] = useState<number[]>([]);

   const max = 3;
   const isMax = ids.length === max;

   const has = (id: number) => ids.includes(id);

   const add = (id: number) => {
      if (!isMax && !has(id)) {
         setIds((prev) => [...prev, id]);
      }
   };

   const getUrl = (overrideIds?: number[]) => {
      return (
         appRoute.compare() + `?${qs.stringify({ ids: overrideIds ?? ids })}`
      );
   };

   const remove = (id: number) => {
      const filtered = ids.filter((i) => i !== id);
      setIds(filtered);
      return filtered;
   };

   const toggle = (id: number) => {
      has(id) ? remove(id) : add(id);
   };

   const clear = () => {
      setIds([]);
   };

   useEffect(() => {
      const parsed = qs.parse(window.location.search, {
         ignoreQueryPrefix: true,
      });

      const parsedIds = Array.isArray(parsed.ids)
         ? parsed.ids.map(Number)
         : typeof parsed.ids === 'string'
           ? parsed.ids.split(',').map(Number)
           : [];

      setIds(parsedIds.filter((n) => !isNaN(n)));
   }, []);

   useEffect(() => {
      if (!isAuthorized) {
         setIds([]);
      }
   }, [isAuthorized]);

   return (
      <ComparisonContext.Provider
         value={{ ids, max, add, remove, clear, has, toggle, isMax, getUrl }}
      >
         {children}
      </ComparisonContext.Provider>
   );
}
