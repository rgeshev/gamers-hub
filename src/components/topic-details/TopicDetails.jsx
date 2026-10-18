import { Link } from 'react-router';

export default function TopicDetails() {
    return (
        <main className="container">
            <section className="page" id="topic-details">
                <p>
                    <Link className="muted" to="/catalog">
                        ← Back to topics
                    </Link>
                </p>

                <article className="details topic-card pc" style={{ borderLeftWidth: 6 }}>
                    <div className="tags">
                        <span className="tag platform">PC</span>
                        <span className="tag">Help & Tips</span>
                    </div>
                    <h1>How do I beat Malenia without summons?</h1>
                    <p className="muted">Elden Ring · posted by NightOwl on 12 Oct 2026</p>
                    <p>
                        I keep getting wiped in phase two. I'm using a strength build with a heavy greatsword and I can't find an opening for the waterfowl dance. What build and timing worked for you?
                    </p>

                    <div className="details-actions">
                        {/* Like: logged-in only. aria-pressed toggles when liked */}
                        <button className="btn like-btn" aria-pressed="false">
                            ♥ Like <span>34</span>
                        </button>
                        {/* Edit / Delete: visible to the AUTHOR only */}
                        <a className="btn" href="edit.html">Edit</a>
                        <button className="btn btn-danger">Delete</button>
                    </div>
                </article>

                <div className="comments">
                    <h2>Comments (2)</h2>

                    {/* component: CommentItem */}
                    <div className="comment">
                        <header>
                            <strong>RaidQueen</strong>
                            <span className="muted">12 Oct, 18:40</span>
                        </header>
                        <p>Bleed build with Uchigatana. Dodge toward her during the flurry, not away.</p>
                    </div>
                    <div className="comment">
                        <header>
                            <strong>PixelPanda</strong>
                            <span className="muted">12 Oct, 19:05</span>
                        </header>
                        <p>Spirit ash is not allowed here, but a shield with Flame Art helped me a lot.</p>
                    </div>

                    {/* component: CommentForm (logged-in only) */}
                    <form style={{ marginTop: '1rem' }} onSubmit={(e) => e.preventDefault()}>
                        <div className="field">
                            <label htmlFor="comment">Add a comment</label>
                            <textarea
                                id="comment"
                                maxLength={500}
                                placeholder="Share your tip or answer"
                            />
                        </div>
                        <button className="btn btn-primary" type="submit">
                            Post comment
                        </button>
                    </form>

                    {/* Guest version of the form area */}
                    <p className="guest-note" style={{ marginTop: '1rem' }}>
                        <a href="login.html">Log in</a> to comment or like this topic.
                    </p>
                </div>
            </section>
        </main>
    );
}
