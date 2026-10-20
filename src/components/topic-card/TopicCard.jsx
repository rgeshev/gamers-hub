import { Link } from 'react-router';

export default function TopicCard({ 
    id,
    platform,
    category,
    title,
    content,
    author,
    comments,
    likes,
}) {
        return (
        <Link to={`/topic-details/${id}`} className={`topic-card ${platform}`}>
            <div className="tags">
                <span className="tag platform">{platform}</span>
                <span className="tag">{category}</span>
            </div>
            <h3>{title}</h3>
            <p className="muted">{platform}</p>
            <p>{content}</p>
            <div className="meta">
                <span>by {author}</span>
                <span>{comments} comments</span>
                <span>{likes} likes</span>
            </div>
        </Link>
    )
}
