export const checkPathname = (pathname: string) => {
  return (
    pathname !== '/login' &&
    pathname !== '/signup' &&
    pathname !== '/recover' &&
    pathname !== '/' &&
    !pathname.includes('reset-password')
  );
};
