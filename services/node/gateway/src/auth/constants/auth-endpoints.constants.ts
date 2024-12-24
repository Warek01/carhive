import { compile } from 'path-to-regexp';

export const AuthEndpoints = {
   login: compile('login'),
   register: compile('register'),
   validate: compile('validate'),
};
