import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Home from "./features/interview/pages/Home";
import ReportPage from "./features/interview/pages/ReportPage";  // ✅ add
import Protected from "./features/auth/components/Protected";
import ReportsListPage from "./features/interview/pages/ReportsListPage"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Protected />}>
          <Route index element={<Home />} />
          <Route path="report/:interviewId" element={<ReportPage />} />  
          <Route path="reports" element={<ReportsListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter; 
