import { NextUIProvider } from "@nextui-org/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </Provider>,
);
