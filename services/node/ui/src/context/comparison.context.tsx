'use client';

import { PropsWithChildren, createContext, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';

export interface ComparisonContextProps {
   max: number;
   isMax: boolean;
   ids: number[];
   has: (id: number) => boolean;
   add: (id: number) => void;
   remove: (id: number) => void;
   toggle: (id: number) => void;
   clear: () => void;
}

export const ComparisonContext = createContext<ComparisonContextProps>(null!);

export function ComparisonContextProvider({ children }: PropsWithChildren) {
   const { isAuthorized } = useAuth();

   const [ids, setIds] = useState<number[]>([]);

   const max = 3;
   const isMax = ids.length === max;

   const has = (id: number) => {
      return ids.includes(id);
   };

   const add = (id: number) => {
      if (!isMax) {
         setIds((ids) => ids.concat(id));
      }
   };

   const remove = (id: number) => {
      setIds((ids) => ids.filter((i) => i !== id));
   };

   const toggle = (id: number) => {
      has(id) ? remove(id) : add(id);
   };

   const clear = () => {
      setIds([]);
   };

   useEffect(() => {
      const idsStr = localStorage.getItem('comparison-ids');
      if (idsStr) {
         setIds(JSON.parse(idsStr));
      }
   }, []);

   useEffect(() => {
      localStorage.setItem('comparison-ids', JSON.stringify(ids));
   }, [ids]);

   useEffect(() => {
      if (!isAuthorized) {
         setIds([]);
      }
   }, [isAuthorized]);

   return (
      <ComparisonContext.Provider
         value={{ ids, max, add, remove, clear, has, toggle, isMax }}
      >
         {children}
      </ComparisonContext.Provider>
   );
}
