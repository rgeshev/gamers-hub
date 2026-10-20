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
import Logout from './components/logout/Logout';

function withUserId(account) {
  return account.id ? account : { ...account, id: crypto.randomUUID() };
}

function loadAuth() {
  let accounts = [];
  try {
    accounts = (JSON.parse(localStorage.getItem('users')) ?? []).map(withUserId);
  } catch {
    accounts = [];
  }

  let current = null;
  try {
    current = JSON.parse(localStorage.getItem('user'));
  } catch {
    current = null;
  }

  if (current) {
    const match = accounts.find((item) => item.email === current.email);
    current = match ?? withUserId(current);
    if (!match) {
      accounts = [...accounts, current];
    }
  }

  localStorage.setItem('users', JSON.stringify(accounts));
  if (current) {
    localStorage.setItem('user', JSON.stringify(current));
  }

  return { accounts, current };
}

function App() {
  const [{ accounts: initialUsers, current: initialUser }] = useState(loadAuth);
  const [users, setUsers] = useState(initialUsers);
  const [user, setUser] = useState(initialUser);

  const saveUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem('user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  const userAuthHandler = (userData) => {
    if (userData.username) {
      const account = withUserId(userData);
      const nextUsers = [...users.filter((item) => item.email !== account.email), account];
      setUsers(nextUsers);
      localStorage.setItem('users', JSON.stringify(nextUsers));
      saveUser(account);
      return true;
    }

    const found = users.find((account) =>
      account.email === userData.email && account.password === userData.password
    );
    if (!found) {
      alert('Wrong email or password. Please try again.');
      return false;
    }

    const account = withUserId(found);
    if (account.id !== found.id) {
      const nextUsers = users.map((item) => item.email === account.email ? account : item);
      setUsers(nextUsers);
      localStorage.setItem('users', JSON.stringify(nextUsers));
    }
    saveUser(account);
    return true;
  }

  const logoutAction = () => {
    saveUser(null);
  }
  
  return (
    <>
    
      <Header user={user} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/topic-details/:topicId" element={<TopicDetails user={user} />} />
        <Route path="/create" element={<TopicCreate user={user} />} />
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
