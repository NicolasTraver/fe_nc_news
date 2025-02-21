import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TopicArticles() {
  const { topic } = useParams();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://be-nc-news-eq02.onrender.com/api/articles?topic=${topic}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch articles");
        return response.json();
      })
      .then((data) => setArticles(data.articles))
      .catch((err) => setError(err.message));
  }, [topic]);
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Articles about {topic}</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.article_id}>
            <h2>{article.title}</h2>
            <p>{article.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopicArticles;

//restructure axios react docs planning
