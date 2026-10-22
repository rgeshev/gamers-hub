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
import { authApi } from './api';

function withUserId(account) {
  return account.id ? account : { ...account, id: crypto.randomUUID() };
}

function mapAccount(session, username) {
  const authUser = session?.user || (session?.id ? session : {});

  return {
    id: authUser.id,
    email: authUser.email,
    username:
      username ||
      authUser.user_metadata?.username ||
      (authUser.email ? authUser.email.split('@')[0] : ''),
    accessToken: session?.access_token,
    refreshToken: session?.refresh_token,
    authorId: authUser.id,
  };
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

  const userAuthHandler = async (userData) => {
    try {
      if (userData.username) {
        const session = await authApi.register({ email: userData.email, password: userData.password });
        const account = mapAccount(session, userData.username);
        const nextUsers = [...users.filter((item) => item.email !== account.email), { ...account, password: userData.password }];
        setUsers(nextUsers);
        localStorage.setItem('users', JSON.stringify(nextUsers));
        saveUser(account);
        return true;
      }

      const session = await authApi.login({ email: userData.email, password: userData.password });
      const account = mapAccount(session);
      const found = users.find((item) => item.email === account.email);
      if (found?.username) {
        account.username = found.username;
      }
      saveUser(account);
      return true;
    } catch (error) {
      alert(error.message || 'Wrong email or password. Please try again.');
      return false;
    }
  }

  const logoutAction = async () => {
    try {
      await authApi.logout();
    } catch {
      // still clear the local session
    }
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
