import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import SortingControls from "../Components/SortingControls";

function TopicArticles() {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sort_by") || "created_at";
  const order = searchParams.get("order") || "desc";
  const limit = 10;
  const page = searchParams.get("p") || 1; //This will default to the first page

  //   console.log(created_at);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const url = `https://be-nc-news-eq02.onrender.com/api/articles?topic=${slug}&sort_by=comment_count&order=${order}&p=${page}&limit=${limit}`;

        console.log("Fetching URL:", url);

        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch articles: ${errorText}`);
        }
        const data = await response.json();

        console.log("Fetched data:", data);

        setArticles(data.articles);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchArticles();
  }, [slug, sortBy, order, page]);
  console.log("Articles after sorting:", articles);

  if (error) return <p>Error: {error}</p>;

  const handleSortChange = (newSortBy, newOrder) => {
    setSearchParams({ sort_by: newSortBy, order: newOrder, p: 1 });
  };

  return (
    <div>
      <h1>Articles about {slug}</h1>
      <SortingControls
        sortBy={sortBy}
        order={order}
        onSortChange={handleSortChange}
      />
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
{
  /* <sortingControls sortBy={sortBy} order={order} onSortChange={handleSortChange}</sortingControls> */
}
