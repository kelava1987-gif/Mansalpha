import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
const paths = [
  "/",
  "/pregled",
  "/knjiznica",
  "/clanci",
  "/prezentacije",
  "/videozapisi",
  "/izvori",
  "/dogadaji",
  "/ideje",
  "/predavanje",
  "/predlosci",
  "/postavke",
];
function Router() {
  const [location] = useLocation();
  return paths.includes(location) ? <Home /> : <NotFound />;
}
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
