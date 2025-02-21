import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function TopicArticles() {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://be-nc-news-eq02.onrender.com/api/articles?topic=${slug}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch articles");
        return response.json();
      })
      .then((data) => setArticles(data.articles))
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Articles about {slug}</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.article_id}>
            <Link to={`/articles/${article.article_id}`}>
              <h2>{article.title}</h2>
            </Link>
            <p>{article.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopicArticles;

//restructure axios react docs planning
