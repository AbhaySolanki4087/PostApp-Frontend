import { useState, useEffect } from "react";
import api from '../api/axiosConfig';
import './CSS/Comments.css'

export default function CommentSection({ blogId, currentUser, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showSection, setShowSection] = useState(false);
  const [count, setCount] = useState(0);

  // Fetch comments whenever blogId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/api/blogs/${blogId}/comments`); // JWT sent automatically
        setComments(res.data.comments || []);
        setCount(res.data.count || 0);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      }
    };
    fetchComments();
  }, [blogId]);

  // Add new comment
  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/api/blogs/${blogId}/comment`, {
        user: currentUser,
        text: newComment,
      });
      setComments(res.data.comments);
      setCount(res.data.count);
      onCountChange(blogId, res.data.comments);
      setNewComment("");
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  // Delete a comment
  const deleteComment = async (commentId) => {
    try {
      const res = await api.delete(`/api/blogs/${blogId}/comment/${commentId}`);
      setComments(res.data.comments);
      setCount(res.data.count);
      onCountChange(blogId, res.data.comments);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <div className="commentWrapper">
      <button onClick={() => setShowSection(!showSection)}>
        💬 {count} {count === 1 ? "Comment" : "Comments"}
      </button>

      {showSection && (
        <div className="commentSection">
          <h4>Comments</h4>

          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="commentItem">
                <strong>{c.user}:</strong> {c.text}
                {c.user === currentUser && (
                  <button onClick={() => deleteComment(c._id)} className="deleteBtn">
                    🗑️
                  </button>
                )}
              </div>
            ))
          )}

          <div className="addComment">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={addComment}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
}
