import ReactDom from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


// const sale = document.getElementById("sale");
// if (!sale) throw new Error("Root element not found");

// ReactDom.createRoot(sale).render(
//   <BrowserRouter>
//     <AppSale />
//   </BrowserRouter>
// );
