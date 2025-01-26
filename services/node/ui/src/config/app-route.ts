import { compile } from 'path-to-regexp';

export const appRoute = {
   home: compile('/'),

   // Listing
   listing: compile('/listing'),
   listingDetails: compile('/listing/:id'),

   // User
   user: compile('/me'),

   // About
   about: compile('/about'),

   // Auth
   login: compile('/login'),
   register: compile('/register'),
};
