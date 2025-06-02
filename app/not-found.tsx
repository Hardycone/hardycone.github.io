/* eslint-disable react/no-unescaped-entities */
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-6">
        The page you're looking for doesn’t exist or has been moved.
      </p>
    </div>
  );
}
