import { isAxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import toast from 'react-hot-toast';

export function toastAuthError(err: unknown) {
   if (isAxiosError(err)) {
      switch (err.response!.status) {
         case StatusCodes.BAD_REQUEST:
            return toast.error('Something went wrong');
         case StatusCodes.UNAUTHORIZED:
            return toast.error('Invalid password');
         case StatusCodes.NOT_FOUND:
            return toast.error('User not found');
         case StatusCodes.CONFLICT:
            return toast.error('User already exists');
      }
   }
   toast.error('Something went wrong');
}
