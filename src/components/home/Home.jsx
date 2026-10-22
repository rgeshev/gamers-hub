import { useState, useEffect } from 'react';
import { topicApi } from '../../api';
import TopicCard from '../topic-card/TopicCard';

export default function Home() {
  const [latestTopics, setLatestTopics] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();

        topicApi.getLatest(3, { signal: abortController.signal })
            .then(setLatestTopics)
            .catch(error => alert(error));
        
        return () => {
          abortController.abort();
        }    
    }, []);

    return (
        <main className="container">
        <section className="page" id="welcome">
          <div className="welcome-message">
            <h2>Level up your</h2>
            <h3>Game talk</h3>
            <p>Ask for help, share tips and find people to play with.</p>
            <a className="btn btn-primary" href="catalog.html">
              Browse topics
            </a>
          </div>
          <div id="latest">
            <h2>Latest topics</h2>
            <div className="topic-list">
              {latestTopics.length > 0 && latestTopics.map((topic) => (
                <TopicCard key={topic.id} {...topic} />
              )) || <div className="state">No topics yet</div>}
            </div>
          </div>
        </section>
      </main>
    )
}