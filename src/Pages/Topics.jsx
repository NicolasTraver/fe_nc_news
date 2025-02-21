import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Topics() {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://be-nc-news-eq02.onrender.com/api/topics`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch topics");
        return response.json();
      })
      .then((data) => setTopics(data.topics))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Topics</h1>
      <ul>
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              to={`https://be-nc-news-eq02.onrender.com/api/topics/${topic.slug}`}
            >
              {topic.slug}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Topics;
