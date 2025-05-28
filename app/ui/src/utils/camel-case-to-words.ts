export function camelCaseToWords(str: string): string {
   return str.replace(/([A-Z])/g, ' $1');
}
