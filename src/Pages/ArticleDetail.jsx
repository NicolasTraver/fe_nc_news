import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ArticleDetail() {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [username] = useState("grumpy19");

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [showCommentBox, setShowCommentBox] = useState({});

  const toggleCommentBox = (articleId) => {
    setShowCommentBox((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

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
  const handleSubmit = async (parentCommentId = null) => {
    const commentText = parentCommentId
      ? replyTexts[parentCommentId]
      : newComment;
    if (!commentText.trim()) {
      setPostError("Comment cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setPostError(null);

    try {
      const response = await fetch(
        `https://be-nc-news-eq02.onrender.com/api/articles/${article_id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            body: commentText,
            parent_comment_id: parentCommentId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to post comment: ${response.status}`);
      }
      const postedComment = await response.json();
      setComments((prevComments) => [postedComment.comment, ...prevComments]);
      if (parentCommentId) {
        setReplyTexts((prev) => ({ ...prev, [parentCommentId]: "" })); //Reseting reply field
      } else {
        setNewComment("");
      }
    } catch (err) {
      setPostError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      const response = await fetch(
        `https://be-nc-news-eq02.onrender.com/api/comments/${commentId}`,
        { method: "DELETE" }
      );
      if (!response.ok)
        throw new Error(`Failed to delete comment: ${response.status}`);
      setComments((prev) =>
        prev.filter((comment) => comment.comment_id !== commentId)
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };
  const renderComments = (parentId = null) => {
    const filteredComments = comments.filter(
      (comment) => comment.parent_comment_id === parentId
    );

    return filteredComments.map((comment) => (
      <li key={comment.comment_id} className="comment">
        <p>
          <strong>{comment.author}:</strong> {comment.body}
        </p>
        <p>Votes: {comment.votes}</p>
        <button onClick={() => toggleCommentBox(comment.comment_id)}>
          {showCommentBox[comment.comment_id] ? "− Hide Reply" : "+ Reply"}
        </button>
        {showCommentBox[comment.comment_id] && (
          <div className="reply-section">
            <textarea
              value={replyTexts[comment.comment_id] || ""}
              onChange={(e) =>
                setReplyTexts((prev) => ({
                  ...prev,
                  [comment.comment_id]: e.target.value,
                }))
              }
              placeholder="Reply to this comment..."
            />
            <button
              onClick={() => handleSubmit(comment.comment_id)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Reply"}
            </button>
          </div>
        )}
        <ul>{renderComments(comment.comment_id)}</ul>{" "}
      </li>
    ));
  };
  //

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

      {/* Add Comment Section */}
      <h2>Add a Comment</h2>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write your comment here..."
      />
      <button onClick={() => handleSubmit(null)} disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
      {postError && <p style={{ color: "red" }}>{postError}</p>}

      {/* Comments Section */}
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

              {comment.author === username && (
                <button
                  onClick={() => handleDelete(comment.comment_id)}
                  className="delete-button"
                >
                  {/* 🗑️ */}
                  <Trash2 size={20} />
                </button>
              )}

              <button onClick={() => toggleCommentBox(comment.comment_id)}>
                {showCommentBox[comment.comment_id]
                  ? "− Hide Comment Box"
                  : "+ Add Reply"}
              </button>

              {showCommentBox[comment.comment_id] && (
                <div className="reply-section">
                  <textarea
                    value={replyTexts[comment.comment_id] || ""}
                    onChange={(e) =>
                      setReplyTexts((prev) => ({
                        ...prev,
                        [comment.comment_id]: e.target.value,
                      }))
                    }
                    placeholder="Reply to this comment..."
                  />
                  <br />
                  <button
                    onClick={() => handleSubmit(comment.comment_id)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Posting..." : "Post Reply"}
                  </button>
                </div>
              )}
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
