import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ArticleDetail() {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [username] = useState("grumpy19");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://be-nc-news-eq02.onrender.com/api/articles/${article_id}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err.message);
      }
    };
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `https://be-nc-news-eq02.onrender.com/api/articles/${article_id}/comments`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setComments(data.comments);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchArticle();
    fetchComments();
  }, [article_id]);

  const handleVote = async (commentId, voteType) => {
    if (!username) {
      alert("You must be logged in to vote!");
      return;
    }
    try {
      console.log(`Voting on comment ID: ${commentId}, Vote Type: ${voteType}`);

      const response = await fetch(
        `https://be-nc-news-eq02.onrender.com/api/comments/${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inc_votes: voteType === "upvote" ? 1 : -1,
            username: username,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        console.log(`Error response from server: ${errorResponse}`);
        throw new Error(`Error: ${response.status}`);
      }

      const updatedComment = await response.json();
      console.log("Updated Comment:", updatedComment);
      setComments((prevComments) => {
        const updatedComments = prevComments.map((comment) =>
          comment.comment_id === updatedComment.comment.comment_id
            ? updatedComment.comment
            : comment
        );
        console.log("Updated Comments State:", updatedComments);
        return updatedComments;
      });
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!article) return <p>Loading...</p>;

  return (
    <div className="article-detail">
      <h1>{article.title}</h1>
      <p>
        <strong>By:</strong> {article.author}
      </p>
      <p>
        <strong>Topic:</strong> {article.topic}
      </p>
      <p>
        <strong>Published:</strong>{" "}
        {new Date(article.created_at).toLocaleDateString()}
      </p>
      <img
        src={article.article_img_url}
        alt={article.title}
        className="article-img"
      />
      <p>{article.body}</p>

      <h2>Comments</h2>
      {comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.comment_id} className="comment">
              <p>
                <strong>{comment.author}:</strong> {comment.body}
              </p>
              <p>Votes: {comment.votes}</p>
              <button onClick={() => handleVote(comment.comment_id, "upvote")}>
                Like
              </button>
              <button
                onClick={() => handleVote(comment.comment_id, "downvote")}
              >
                Dislike
              </button>
              <p>{new Date(comment.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
}

export default ArticleDetail;
