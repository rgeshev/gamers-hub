import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { topicApi } from '../../api';
import TopicCard from '../topic-card/TopicCard';
import { isAbortError } from '../../utils/validation';

export default function Home() {
    const [latestTopics, setLatestTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const abortController = new AbortController();
        setIsLoading(true);
        setError('');

        topicApi.getLatest(3, { signal: abortController.signal })
            .then((topics) => {
                setLatestTopics(topics);
                setIsLoading(false);
            })
            .catch((err) => {
                if (isAbortError(err)) {
                    return;
                }
                setError(err.message || 'Could not load latest topics.');
                setIsLoading(false);
            });

        return () => {
            abortController.abort();
        };
    }, []);

    return (
        <main className="container">
            <section className="page" id="welcome">
                <div className="welcome-message">
                    <h2>Level up your</h2>
                    <h3>Game talk</h3>
                    <p>Ask for help, share tips and find people to play with.</p>
                    <Link className="btn btn-primary" to="/catalog">
                        Browse topics
                    </Link>
                </div>
                <div id="latest">
                    <h2>Latest topics</h2>
                    {isLoading && <div className="state">Loading topics...</div>}
                    {error && <div className="alert-error" role="alert">{error}</div>}
                    {!isLoading && !error && (
                        <div className="topic-list">
                            {latestTopics.length > 0
                                ? latestTopics.map((topic) => (
                                    <TopicCard key={topic.id} {...topic} />
                                ))
                                : <div className="state">No topics yet</div>}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
