import { useState } from 'react';
import { Heart, MessageCircle, Plus } from 'lucide-react';
import { CreatePostModal } from './CreatePostModal';
import '../styles/community.css';

// Mock data
const MOCK_POSTS = [
  {
    id: 1,
    author: 'Sarah Johnson',
    avatar: 'SJ',
    time: '2 hours ago',
    content: 'Just hit my protein goal for the 7th day in a row! Consistency is key 💪',
    likes: 24,
    comments: 5,
    isLiked: false
  },
  {
    id: 2,
    author: 'Mike Chen',
    avatar: 'MC',
    time: '4 hours ago',
    content: 'Anyone else find it hard to hit their fat macros? I always go over on protein instead 😅',
    likes: 12,
    comments: 8,
    isLiked: true
  },
  {
    id: 3,
    author: 'Emma Williams',
    avatar: 'EW',
    time: '6 hours ago',
    content: 'Meal prep Sunday complete! Ready for a successful week of hitting my calorie goals 🥗',
    likes: 45,
    comments: 12,
    isLiked: false
  },
  {
    id: 4,
    author: 'David Kim',
    avatar: 'DK',
    time: '8 hours ago',
    content: 'Pro tip: Greek yogurt is a game changer for hitting protein goals. 20g per serving!',
    likes: 67,
    comments: 15,
    isLiked: true
  },
  {
    id: 5,
    author: 'Lisa Martinez',
    avatar: 'LM',
    time: '1 day ago',
    content: 'Down 10 pounds this month while staying in my calorie range. This app has changed my life! 🎉',
    likes: 89,
    comments: 23,
    isLiked: false
  }
];

export function Community() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleCreatePost = (content: string) => {
    const newPost = {
      id: Date.now(),
      author: 'You',
      avatar: 'YO',
      time: 'Just now',
      content,
      likes: 0,
      comments: 0,
      isLiked: false
    };
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
  };

  return (
    <div className="community">
      <div className="community-header">
        <div>
          <h1>Community</h1>
          <p>Connect with others on their fitness journey</p>
        </div>
        <button className="create-post-btn" onClick={() => setShowCreatePost(true)}>
          <Plus size={20} />
          Create Post
        </button>
      </div>

      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="avatar">{post.avatar}</div>
                <div>
                  <h4>{post.author}</h4>
                  <span className="post-time">{post.time}</span>
                </div>
              </div>
            </div>

            <div className="post-content">
              <p>{post.content}</p>
            </div>

            <div className="post-actions">
              <button 
                className={`action-btn ${post.isLiked ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <Heart size={20} fill={post.isLiked ? '#e74c3c' : 'none'} />
                <span>{post.likes}</span>
              </button>
              <button className="action-btn">
                <MessageCircle size={20} />
                <span>{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreatePost && (
        <CreatePostModal 
          onClose={() => setShowCreatePost(false)}
          onCreate={handleCreatePost}
        />
      )}
    </div>
  );
}
