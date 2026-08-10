/* eslint-disable react/no-unescaped-entities */
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex h-[100svh] flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-4">404 – Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        Thanks for visiting my site! I'm sorry the page you're looking for
        doesn't exist or has been moved. Hit "Home" to explore the rest of my
        work!
      </p>
    </div>
  );
}
