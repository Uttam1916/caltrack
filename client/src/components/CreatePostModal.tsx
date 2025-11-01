import { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/modal.css';

interface CreatePostModalProps {
  onClose: () => void;
  onCreate: (content: string) => void;
}

export function CreatePostModal({ onClose, onCreate }: CreatePostModalProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onCreate(content);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Post</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="content">What's on your mind?</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your progress, tips, or ask questions..."
              rows={6}
              required
            />
          </div>

          <button type="submit" className="submit-btn">Post</button>
        </form>
      </div>
    </div>
  );
}
