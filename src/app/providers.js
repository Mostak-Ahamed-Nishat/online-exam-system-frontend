"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthHydrator } from "@/features/auth/components/auth-hydrator";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  );
}
