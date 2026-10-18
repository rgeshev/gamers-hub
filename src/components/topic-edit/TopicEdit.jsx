import { Link, useParams } from 'react-router';

export default function TopicEdit() {
    const { topicId } = useParams();

    return (
        <main className="container">
            <section className="page" id="edit-page">
                <h1>Edit topic</h1>
                <form className="form-card" onSubmit={(e) => e.preventDefault()} noValidate>
                    <div className="field">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            defaultValue="How do I beat Malenia without summons?"
                            aria-describedby="title-err"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="game">Game</label>
                        <input id="game" type="text" placeholder="e.g. Elden Ring" />
                    </div>

                    <div className="form-row">
                        <div className="field">
                            <label htmlFor="platform">Platform</label>
                            <select id="platform" defaultValue="">
                                <option value="">Select platform</option>
                                <option>PC</option>
                                <option>PlayStation</option>
                                <option>Xbox</option>
                                <option>Switch</option>
                                <option>Mobile</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="category">Category</label>
                            <select id="category" defaultValue="">
                                <option value="">Select category</option>
                                <option>Help & Tips</option>
                                <option>News</option>
                                <option>Looking for Group</option>
                                <option>Reviews</option>
                                <option>General</option>
                            </select>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="image">Image URL (optional)</label>
                        <input id="image" type="url" placeholder="https://..." />
                    </div>

                    <div className="field">
                        <label htmlFor="content">Content</label>
                        <textarea id="content" placeholder="At least 20 characters" />
                    </div>

                    <button className="btn btn-primary" type="submit">
                        Save changes
                    </button>
                    <Link className="btn" to={topicId ? `/topic-details/${topicId}` : '/catalog'}>
                        Cancel
                    </Link>
                </form>
            </section>
        </main>
    );
}
