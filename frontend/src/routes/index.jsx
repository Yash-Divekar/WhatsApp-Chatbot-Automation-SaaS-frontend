import { Routes, Route } from "react-router-dom";
import navList from "@/lib/navList";

export default function AppRoutes() {
  return (
    <Routes>
      {navList.map((item) => (
        <Route key={item.url} path={item.url} element={<item.page />} />
      ))}
    </Routes>
  );
}
