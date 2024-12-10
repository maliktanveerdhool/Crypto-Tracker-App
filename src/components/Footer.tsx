export const Footer = () => {
  return (
    <footer className="border-t mt-8 py-8 bg-card">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground">
          This web app is built by{" "}
          <a
            href="https://mtdtechnologies.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            MTD Technologies
          </a>
        </p>
      </div>
    </footer>
  );
};