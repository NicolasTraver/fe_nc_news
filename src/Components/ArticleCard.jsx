import { Link } from "react-router-dom";
import UserInfo from "./UserInfo";

function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <UserInfo />
      <Link to={`/articles/${article.article_id}`} className="article-link">
        <img
          src={article.article_img_url}
          alt={article.title}
          className="article-img"
        />
        <div className="article-content">
          <h2>{article.title}</h2>
          <p>By {article.author}</p>
          <p>Topic: #{article.topic} </p>
          <p>Date: {article.created_at}</p>
        </div>
      </Link>
    </div>
  );
}

export default ArticleCard;
