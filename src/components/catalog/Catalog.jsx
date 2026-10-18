export default function Catalog() {
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
                    <a className="btn btn-primary" href="create.html">
                        Start a topic
                    </a>
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
                <div className="topic-list">
                    <a className="topic-card pc" href="details.html">
                        <div className="tags">
                            <span className="tag platform">PC</span>
                            <span className="tag">Help & Tips</span>
                        </div>
                        <h3>How do I beat Malenia without summons?</h3>
                        <p className="muted">Elden Ring</p>
                        <p>I keep getting wiped in phase two. What build and timing worked for you?</p>
                        <div className="meta">
                            <span>by NightOwl</span>
                            <span>12 comments</span>
                            <span>34 likes</span>
                        </div>
                    </a>

                    <a className="topic-card ps" href="details.html">
                        <div className="tags">
                            <span className="tag platform">PlayStation</span>
                            <span className="tag">Looking for Group</span>
                        </div>
                        <h3>Need two more for Friday raid night</h3>
                        <p className="muted">Destiny 2</p>
                        <p>We run a chill team, no experience needed. Evenings, European time.</p>
                        <div className="meta">
                            <span>by RaidQueen</span>
                            <span>5 comments</span>
                            <span>9 likes</span>
                        </div>
                    </a>

                    <a className="topic-card switch" href="details.html">
                        <div className="tags">
                            <span className="tag platform">Switch</span>
                            <span className="tag">Reviews</span>
                        </div>
                        <h3>Is Hollow Knight worth it in 2026?</h3>
                        <p className="muted">Hollow Knight</p>
                        <p>Thinking of picking it up. Is the map system as confusing as people say?</p>
                        <div className="meta">
                            <span>by PixelPanda</span>
                            <span>21 comments</span>
                            <span>58 likes</span>
                        </div>
                    </a>
                </div>

                {/* component: EmptyState (show when no topics match) */}
                <div className="state" style={{ marginTop: '1.5rem' }}>
                    No topics match your filters. Try a different game or clear the filters.
                </div>
            </section>
        </main>
    );
}
