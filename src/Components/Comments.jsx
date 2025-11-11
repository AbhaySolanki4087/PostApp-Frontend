import { useState, useEffect } from "react";
import api from '../api/axiosConfig';
import './CSS/Comments.css'

export default function CommentSection({ blogId, currentUser, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showSection, setShowSection] = useState(false);
  const [count, setCount] = useState(0);

useEffect(() => {
  const fetchComments = async () => {
    try {
      const res = await api.get(`/blogs/${blogId}/comments`);
      setComments(res.data.comments);
      setCount(res.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  fetchComments();
}, [blogId]); // include blogId in case it changes


const addComment = async () => {
  if (!newComment.trim()) return;
  try {
    const res = await api.post(`/blogs/${blogId}/comment`, {
      user: currentUser,  // string username
      text: newComment,
    });
    setComments(res.data.comments);
    setCount(res.data.count);
    onCountChange(blogId, res.data.comments); // pass array to HomePage
    setNewComment("");
  } catch (err) {
    console.error(err);
  }
};


const deleteComment = async (commentId) => {
  try {
    const res = await api.delete(`/blogs/${blogId}/comment/${commentId}`);
    setComments(res.data.comments);
    setCount(res.data.count);
    onCountChange(blogId, res.data.comments); // update parent with new array
  } catch (err) {
    console.error(err);
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
                {c.user === currentUser && (    // currentUser is also a string
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