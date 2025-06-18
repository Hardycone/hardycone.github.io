/* eslint-disable react/no-unescaped-entities */
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <h1 className="font-sans text-4xl font-bold mb-4">
        404 – Page Not Found
      </h1>
      <p className="font-serif text-lg text-muted-foreground mb-6">
        Looks like this page doesn't exist or has been moved. Hit "Home" to
        explore the rest of my work!
      </p>
    </div>
  );
}
