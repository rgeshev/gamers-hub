import Header from './components/header/Header';
import Home from './components/home/Home';
import Footer from './components/footer/Footer';
import Catalog from './components/catalog/Catalog';
import TopicDetails from './components/topic-details/TopicDetails';
import TopicCreate from './components/topic-create/TopicCreate';
import TopicEdit from './components/topic-edit/TopicEdit';
import Login from './components/login/Login';
import Register from './components/register/Register';
import { Routes, Route } from 'react-router';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Logout from './components/logout/Logout';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const userAuthHandler = (userData) => {
    setUser(userData);
  }

  const logoutAction = () => {
    setUser(null);
  }
  
  return (
    <>
    
      <Header user={user} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/topic-details/:topicId" element={<TopicDetails />} />
        <Route path="/create" element={<TopicCreate />} />
        <Route path="/edit/:topicId" element={<TopicEdit />} />
        <Route path="/login" element={<Login onLogin={userAuthHandler} />} />
        <Route path="/register" element={<Register onRegister={userAuthHandler} />} />
        <Route path="/logout" element={<Logout onLogout={logoutAction} />} />
      </Routes>
      
      <Footer />
    </>
  );
}

export default App;
