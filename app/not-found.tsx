/* eslint-disable react/no-unescaped-entities */
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-4 font-sans text-4xl font-bold">
        404 – Page Not Found
      </h1>
      <p className="text-muted-foreground mb-6 font-serif text-lg">
        Thanks for visiting my site! I'm sorry the page you're looking for
        doesn't exist or has been moved. Hit "Home" to explore the rest of my
        work!
      </p>
    </div>
  );
}
