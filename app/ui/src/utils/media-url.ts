export const mediaUrl = (url: string): string => {
   if (URL.canParse(url)) {
      return url;
   }

   return new URL(url, process.env.NEXT_PUBLIC_MEDIA_BASE_URL).toString();
};
