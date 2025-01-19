import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const BlogView = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: 'Bienvenidos a nuestro blog', content: 'Este es nuestro primer post...', date: '2023-05-15' },
    { id: 2, title: 'Actividades de verano', content: 'Este verano tendremos...', date: '2023-05-20' },
  ]);

  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleInputChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    setPosts([...posts, { id: posts.length + 1, ...newPost, date: new Date().toISOString().split('T')[0] }]);
    setNewPost({ title: '', content: '' });
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión del Blog</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddPost} className="tw-space-y-4">
          <input
            type="text"
            name="title"
            value={newPost.title}
            onChange={handleInputChange}
            placeholder="Título del post"
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <textarea
            name="content"
            value={newPost.content}
            onChange={handleInputChange}
            placeholder="Contenido del post"
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-h-32"
            required
          ></textarea>
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Post
          </button>
        </form>
      </div>
      <div className="tw-space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <h3 className="tw-text-xl tw-font-semibold tw-mb-2">{post.title}</h3>
            <p className="tw-text-gray-600 tw-mb-4">{post.content}</p>
            <div className="tw-flex tw-justify-between tw-items-center">
              <span className="tw-text-sm tw-text-gray-500">{post.date}</span>
              <div>
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3">
                  <Edit className="tw-w-5 tw-h-5" />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900" onClick={() => handleDeletePost(post.id)}>
                  <Trash className="tw-w-5 tw-h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogView;

