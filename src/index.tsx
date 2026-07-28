import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "~/app/providers";
import { enableMocking } from "~/mocks/enable-mocking";
import { Root } from "./root";

async function bootstrap() {
  try {
    await enableMocking();
  } catch (error) {
    console.error("Failed to start the mock API worker.", error);
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AppProviders>
        <Root />
      </AppProviders>
    </StrictMode>,
  );
}

void bootstrap();
