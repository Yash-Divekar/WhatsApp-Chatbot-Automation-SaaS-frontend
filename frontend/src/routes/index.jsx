import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import navList from "@/lib/navList";
import PageLoader from "@/components/pageLoader";
import NotFound from "@/pages/NotFound";

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Redirect base path to Home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Dynamically render pages from navList */}
        {navList.map((item) => (
          <Route key={item.url} path={item.url} element={<item.page />} />
        ))}

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}