import { compile } from 'path-to-regexp';

export const listingEndpoints = {
   get: compile(''),
   create: compile(''),
   getOne: compile(':id'),
};
