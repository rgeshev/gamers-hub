import { Link } from 'react-router';
import { platformClass } from '../../utils/platformClass';

export default function TopicCard({ 
    id,
    platform,
    category,
    title,
    content,
    author,
    comments,
}) {
        return (
        <Link to={`/topic-details/${id}`} className={`topic-card ${platformClass(platform)}`}>
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
            </div>
        </Link>
    )
}
