import { ThemeProvider } from "@/contexts/theme-context";
import { IDE } from "@/components/ide";
import { ErrorBoundary } from "@/components/error-boundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <IDE />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
