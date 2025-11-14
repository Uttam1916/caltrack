import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Plus, Trash } from 'lucide-react';
import { CreatePostModal } from './CreatePostModal';
import '../styles/community.css';

interface CommunityProps {
  currentUser: any | null;
}

export function Community({ currentUser }: CommunityProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) throw new Error(`Failed to load posts ${res.status}`);
        const data = await res.json();
        setPosts(data.map((p: any) => ({
          id: p._id,
          authorId: p.authorId,
          authorName: p.authorName,
          content: p.content,
          likes: p.likes,
          comments: p.comments,
          createdAt: p.createdAt
        })));
      } catch (err) {
        console.error('Error loading posts', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const handleCreatePost = async (content: string) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, authorId: currentUser?.id, authorName: currentUser?.name || currentUser?.username })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to create post: ${res.status}`);
      }
      const created = await res.json();
      setPosts(prev => [{ id: created._id, authorId: created.authorId, authorName: created.authorName, content: created.content, likes: created.likes, comments: created.comments, createdAt: created.createdAt }, ...prev]);
      setShowCreatePost(false);
    } catch (err) {
      console.error('Failed to create post', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!currentUser) return;
    try {
  const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to delete post: ${res.status}`);
      }
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Delete failed', err);
    }
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
        {loading && <p>Loading posts...</p>}
        {!loading && posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="avatar">{post.authorName ? post.authorName.split(' ').map((s:string)=>s[0]).join('').slice(0,2) : '??'}</div>
                <div>
                  <h4>{post.authorName}</h4>
                  <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
              </div>
              {currentUser && post.authorId === currentUser.id && (
                <button className="delete-post-btn" onClick={() => handleDeletePost(post.id)} title="Delete post">
                  <Trash size={16} />
                </button>
              )}
            </div>

            <div className="post-content">
              <p>{post.content}</p>
            </div>

            <div className="post-actions">
              <button className={`action-btn`}>
                <Heart size={20} />
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
