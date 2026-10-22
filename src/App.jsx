import Header from './components/header/Header';
import Home from './components/home/Home';
import Footer from './components/footer/Footer';
import Catalog from './components/catalog/Catalog';
import TopicDetails from './components/topic-details/TopicDetails';
import TopicCreate from './components/topic-create/TopicCreate';
import TopicEdit from './components/topic-edit/TopicEdit';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Logout from './components/logout/Logout';
import AuthGuard from './components/guards/AuthGuard';
import GuestGuard from './components/guards/GuestGuard';
import { Routes, Route } from 'react-router';

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/topic-details/:topicId" element={<TopicDetails />} />

        <Route element={<AuthGuard />}>
          <Route path="/create" element={<TopicCreate />} />
          <Route path="/edit/:topicId" element={<TopicEdit />} />
          <Route path="/logout" element={<Logout />} />
        </Route>

        <Route element={<GuestGuard />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
