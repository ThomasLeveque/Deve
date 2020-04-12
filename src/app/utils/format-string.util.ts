export function getDomain(url: string): string {
  return url.replace(/^https?:\/\//i, '').split('/')[0];
}

export const formatError = (err: any): string => {
  return err.message || err.toString();
};
