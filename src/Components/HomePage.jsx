// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Image, Send, User, Heart, MessageCircle, Calendar, X,  Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CommentSection from "./Comments";
import api from '../api/axiosConfig';
import './CSS/homePage.css';
import './CSS/HomePageForm.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [blogs, setBlogs] = useState([]);
  const [myPosts, setMyPosts] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('Technology');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [openComments, setOpenComments] = useState(null);


  // ✅ Safe fetch useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user profile
        if (!currentUser) {
          const res = await api.get('/api/profile'); // JWT sent automatically
          if (res.data.success && res.data.user) {
            setCurrentUser(res.data.user.name);
          } else {
            navigate('/login');
            return;
          }
        }

        // Fetch blogs
        const resBlogs = await api.get('/api/blogs'); // JWT sent automatically
        setBlogs(resBlogs.data.blogs || []);
      } catch (err) {
        console.error(err);
        navigate('/login'); // if anything fails, redirect to login
      }
    };

    fetchData();
  }, [currentUser, navigate]);


  // Update myPosts whenever blogs or currentUser changes
  useEffect(() => {
    if (currentUser) {
      setMyPosts(blogs.filter(blog => blog.author === currentUser));
    }
  }, [blogs, currentUser]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
  };

const handleSubmitPost = async () => {
  if (!currentUser) return alert('You must be logged in to create a post!');
  if (!postTitle.trim() || !postContent.trim()) return alert('Title and content are required!');

  try {
    const formData = new FormData();
    formData.append('title', postTitle);
    formData.append('content', postContent);
    formData.append('category', postCategory);
    if (uploadedImage) formData.append('image', uploadedImage);

    const res = await api.post('/api/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }, // JWT automatically included via axios
    });

    if (res.data.success) {
      setBlogs([res.data.blog, ...blogs]);
      setPostTitle('');
      setPostContent('');
      setPostCategory('Technology');
      setUploadedImage(null);
      setImagePreview(null); 
      setShowCreateForm(false);
      alert('Post created successfully!');
    }
  } catch (err) {
    console.error(err);
    if (err.response?.status === 401) alert('You must be logged in to create a post.');
    else alert('Failed to create post.');
  }
};

// handle user commnets on blog
const handleCommentCountChange = (blogId, newCommentsArray) => {
  setBlogs(prev =>
    prev.map(blog =>
      blog._id === blogId ? { ...blog, comments: newCommentsArray } : blog
    )
  );
};

// handle likes
const handleLike = async (blogId) => {
  try {
    const res = await api.post(`/api/blogs/${blogId}/like`); // JWT sent automatically via headers
    setBlogs(prev =>
      prev.map(blog =>
        blog._id === blogId ? { ...blog, likes: res.data.likes, likedBy: res.data.likedBy } : blog
      )
    );
  } catch (err) {
    console.error('Failed to like the post:', err);
  }
};


// handle share 
const handleShare = async (blog) => {
  const shareUrl = `${window.location.origin}/blog/${blog._id}`;
  const shareText = `${blog.title} — Check out this post on BlogHub!`;

  if (navigator.share) {
    // ✅ Native mobile/desktop share dialog
    try {
      await navigator.share({
        title: blog.title,
        text: shareText,
        url: shareUrl,
      });
    } catch (err) {
      console.log('Share cancelled or failed:', err);
    }
  } else {
    // 📋 Fallback — copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Post link copied to clipboard!');
    } catch (err) {
      alert('Failed to copy link.');
    }
  }
};

  const displayBlogs = activeTab === 'all' ? blogs : myPosts;

  return (
    <div className="HomePageContainer">
      {/* Hero Section */}
      <div className="hero">
        <h1 className="heroTitle">Welcome to PostSphere</h1>
        <p className="heroSubtitle">Share your thoughts and discover amazing stories from the community</p>
        <button className="createPostBtn" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Close Form' : '+ Create New Post'}
        </button>
      </div>

      {/* Create Post Form */}
      {showCreateForm && (
        <div className="createSection">
          <h2 className="createTitle">Create New Post</h2>

          <div className="formGroup">
            <label className="label">Category</label>
            <select className="select" value={postCategory} onChange={(e) => setPostCategory(e.target.value)}>
              <option>Technology</option>
              <option>React</option>
              <option>JavaScript</option>
              <option>CSS</option>
              <option>Java</option>
              <option>Design</option>
              <option>Backend</option>
              <option>TypeScript</option>
            </select>
          </div>

          <div className="formGroup">
            <label className="label">Title</label>
            <input
              type="text"
              className="input"
              placeholder="Enter your post title..."
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
          </div>

          <div className="formGroup">
            <label className="label">Content</label>
            <textarea
              className="textarea"
              placeholder="Write your post content..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>

          {imagePreview && (
            <div className="imagePreview">
              <img src={imagePreview} alt="Preview" className="previewImage" />
              <button className="removeImageBtn" onClick={handleRemoveImage}>
                <X size={20} />
              </button>
            </div>
          )}

          <div className="bottomActions">
            <label className="imageUploadBtn">
              <Image size={20} />
              <span>Add Image</span>
              <input 
                type="file" 
                accept="image/*" 
                className="fileInput" 
                onChange={handleImageUpload} 
              />
            </label>

            <button className="submitBtn" onClick={handleSubmitPost}>
              <Send size={20} />
              <span>Post</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <div className="tabsContainer">
        <button className={`tab ${activeTab === 'all' ? 'tabActive' : ''}`} onClick={() => setActiveTab('all')}>
          All Posts ({blogs.length})
        </button>
        <button className={`tab ${activeTab === 'my' ? 'tabActive' : ''}`} onClick={() => setActiveTab('my')}>
          My Posts ({myPosts.length})
        </button>
      </div>

      {/* Blogs Grid */}
      <div className="blogsSection">
        {displayBlogs.length === 0 ? (
          <div className="noPosts">
            <p>No posts yet. Create your first post!</p>
          </div>
        ) : (
          <div className="blogsGrid">
            {displayBlogs.map(blog => (
              <div key={blog._id} className="blogCard">
                <div className="categoryBadge">{blog.category}</div>
                {blog.image && (
                  <div className="postImageContainer">
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}${blog.image}`}
                      alt={blog.title}
                      className="postImage"
                    />

                  </div>
                )}
                <h3 className="blogTitle">{blog.title}</h3>
                <p className="blogContent">{blog.content}</p>
                <div className="blogFooter">
                  <div className="blogMeta">
                    <div className="metaItem metaColumn">
                      <User size={16} />
                      <span className="authorName">{blog.author}</span>
                      <div className="dateRow">
                        <Calendar size={14} />
                        <span>{new Date(blog.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="blogActions">
                    <button
                      className={`actionButton ${blog.likedBy?.includes(currentUser) ? 'actionButtonActive' : ''}`}
                      onClick={() => handleLike(blog._id)}
                    >
                      <Heart 
                        size={18} 
                        fill={blog.likedBy?.includes(currentUser) ? '#ff4757' : 'none'} 
                      />
                      <span>{blog.likes}</span>
                    </button>


                    <button className="actionButton" onClick={() => setOpenComments(openComments === blog._id ? null : blog._id) }>
                      <MessageCircle size={18} />
                      <span>{blog.comments.length}</span> 
                      {/* render number, not array */}
                    </button>


                    <button
                      className="actionButton"
                      onClick={() => handleShare(blog)}
                    >
                      <Share2 size={18} />
                    </button>

                  </div>
                </div>
                {openComments === blog._id && (
                  <CommentSection
                    blogId={blog._id}  
                    currentUser={currentUser}
                    onCountChange={handleCommentCountChange}
                  />
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
