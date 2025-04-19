'use client';

import { useContext } from 'react';

import { ComparisonContext } from '@/context/comparison.context';

export function useComparison() {
   return useContext(ComparisonContext);
}
