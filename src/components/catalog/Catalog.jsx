import { useEffect, useState } from "react";
import { Link } from "react-router";
import request from "../../utils/request";
import TopicCard from "../topic-card/TopicCard";

export default function Catalog() {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        request("/topics?order=created_at.desc")
            .then(setTopics)
            .catch(err => alert(err))
    }, []);

    return (
        <main className="container">
            <section className="page" id="catalog-page">
                <div className="page-head">
                    <div>
                        <h1>Catalog</h1>
                        <p className="muted" style={{ margin: 0 }}>
                            Ask for help, share tips and find people to play with.
                        </p>
                    </div>
                    <Link className="btn btn-primary" to="/create">
                        Start a topic
                    </Link>
                </div>

                {/* component: TopicFilters (controlled inputs) */}
                <div className="filters">
                    <div className="search">
                        <label htmlFor="q">Search by game</label>
                        <input id="q" type="search" placeholder="e.g. Elden Ring" />
                    </div>
                    <div>
                        <label htmlFor="f-platform">Platform</label>
                        <select id="f-platform">
                            <option>All</option>
                            <option>PC</option>
                            <option>PlayStation</option>
                            <option>Xbox</option>
                            <option>Switch</option>
                            <option>Mobile</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="f-category">Category</label>
                        <select id="f-category">
                            <option>All</option>
                            <option>Help & Tips</option>
                            <option>News</option>
                            <option>Looking for Group</option>
                            <option>Reviews</option>
                            <option>General</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="f-sort">Sort by</label>
                        <select id="f-sort">
                            <option>Newest</option>
                            <option>Most liked</option>
                        </select>
                    </div>
                </div>

                {/* component: TopicList -> TopicCard (repeat per topic) */}
                {topics.length > 0
                    ? (
                        <div className="topic-list">
                            {topics.map(topic => <TopicCard key={topic.id} {...topic} />)}
                        </div>
                    )
                    : (
                        <div className="state" style={{ marginTop: '1.5rem' }}>
                            No topics match your filters. Try a different game or clear the filters.
                        </div>
                    )
                }
            </section>
        </main>
    );
}
