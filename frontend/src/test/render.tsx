import { MantineProvider } from "@mantine/core";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";

export const renderWithProviders = (ui: ReactNode) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};
