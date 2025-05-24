import { BrowserRouter, Route, Routes } from "react-router-dom";
import Albums from "../pages/Albums";
import Users from "../pages/Users";
import UserDetail from "../pages/UserDetail";
import AlbumDetail from "../pages/AlbumDetail";
import { Navigate } from "react-router-dom";

const Router = () => {

  return (
    <BrowserRouter>

    <Routes>
      <Route path="/" element={<Navigate to="/albums" replace />} />
      <Route path="/albums" element={<Albums  />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="/albums/:id" element={<AlbumDetail />} />
    </Routes>
    </BrowserRouter>
  );
};

export default Router;