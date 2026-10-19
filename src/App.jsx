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

function App() {
  const [user, setUser] = useState(null);

  const userAuthHandler = (userData) => {
    setUser(userData);
  }

  return (
    <>
    
      <Header />
      { user && <p>Welcome, {user.email}!</p>}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/topic-details/:topicId" element={<TopicDetails />} />
        <Route path="/create" element={<TopicCreate />} />
        <Route path="/edit/:topicId" element={<TopicEdit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register onRegister={userAuthHandler} />} />
      </Routes>
      
      <Footer />
    </>
  );
}

export default App;
