import { compile } from 'path-to-regexp';

export const appRoute = {
   home: compile('/'),

   // Listing
   listing: compile('/listing'),
   listingDetails: compile('/listing/:id'),
   newListings: compile('/new'),

   recommendation: compile('/recommendation'),

   // User
   user: compile('/me'),

   // Admin
   dashboard: compile('/dashboard'),
   dashboardScraping: compile('/dashboard/scraping'),
   dashboardListing: compile('/dashboard/listing'),
   dashboardRecommendation: compile('/dashboard/recommendation'),
   dashboardUser: compile('/dashboard/user'),

   // About
   about: compile('/about'),

   // Auth
   login: compile('/login'),
   register: compile('/register'),
};
