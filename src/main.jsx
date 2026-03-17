import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UserPage from './App.jsx'
import AdminPage from "./Admin";

const Root = () => {
  // Ye line check karti hai ki URL mein ?admin=true hai ya nahi
  const queryParams = new URLSearchParams(window.location.search);
  const isAdmin = queryParams.get('admin') === 'true';

  // Agar admin hai toh Admin page dikhao, varna normal App dikhao
  return isAdmin ? <AdminPage /> : <UserPage />;
};


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
