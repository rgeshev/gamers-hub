import Header from './components/header/Header';
import Home from './components/home/Home';
import Footer from './components/footer/Footer';
import Catalog from './components/catalog/Catalog';
import TopicDetails from './components/topic-details/TopicDetails';
import { Routes, Route } from 'react-router';

function App() {
  return (
    <>
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/topic-details/:topicId" element={<TopicDetails />} />
      </Routes>
      
      <Footer />
    </>
  );
}

export default App;
