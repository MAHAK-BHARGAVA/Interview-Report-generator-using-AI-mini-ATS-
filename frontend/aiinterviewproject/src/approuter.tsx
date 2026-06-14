import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
// import Home from "./features/interview/pages/Home";

import Protected from "./features/auth/components/Protected";
import InterviewReportUI from "./features/interview/pages/interviewpage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Protected />}>
          <Route index element={<InterviewReportUI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default AppRouter; 
