import { AuthProvider } from "@/context/AuthContext";
import { MutualFundProvider } from "@/context/MutualFundContext";
import { RealEstateProvider } from "@/context/RealEstateContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { StockProvider } from "@/context/StockContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <StockProvider>
            <MutualFundProvider>
              <RealEstateProvider>{children}</RealEstateProvider>
            </MutualFundProvider>
          </StockProvider>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
