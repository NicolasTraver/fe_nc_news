import { useEffect, useState } from "react";
import ArticleCard from "../Components/ArticleCard";
import UserInfo from "../Components/UserInfo";

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "https://be-nc-news-eq02.onrender.com/api/articles"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const { articles } = await response.json();
        setArticles(articles);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchArticles();
  }, []);
  return (
    <>
      <UserInfo />
      <div className="article-list">
        <h1>All Articles</h1>
        <div className="article-cards">
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard key={article.article_id} article={article} />
            ))
          ) : (
            <p>No articles available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ArticleList;
