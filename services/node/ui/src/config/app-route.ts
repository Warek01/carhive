import { compile } from 'path-to-regexp';

export const appRoute = {
   home: compile('/'),

   // Listing
   listing: compile('/listing'),
   /** @property id */
   listingDetails: compile('/listing/:id'),

   // Auth
   login: compile('/login'),
   register: compile('/register'),
};
