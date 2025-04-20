import Link from "next/link";
import Container from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center h-full px-4 py-24 text-center">
        <h2 className="text-3xl font-bold text-black">404</h2>
        <p className="mt-4 text-xl text-neutral-600">Page Not Found</p>
        <p className="mt-2 text-neutral-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="px-4 py-2 mt-8 font-medium text-white transition rounded-md bg-black hover:opacity-80"
        >
          Return Home
        </Link>
      </div>
    </Container>
  );
} 