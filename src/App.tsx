// ============================================
// App.tsx - Main Application Entry Point
// NASENI Leave Management System
// ============================================

import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { AppRoutes } from "@/components/routes/AppRoutes";
import naseniTheme from "@/theme/naseniTheme";
import { GlobalStyles } from "@/theme/GlobalStyles";

const queryClient = new QueryClient();

function App() {
  return (
    <ChakraProvider theme={naseniTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
