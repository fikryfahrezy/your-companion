import { BrowserRouter, Route, Routes } from "react-router";
import { Hello } from "~/hello";

export function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </BrowserRouter>
  );
}
