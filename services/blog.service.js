import { request, pickList, pickObject } from '@/utils/api';

const blogObj = (d) => pickObject(d, ['blog', 'post']);

export const blogService = {
  /** GET /blogs?title=&category= (empty params are omitted) */
  getBlogs: async ({ title, category } = {}) =>
    pickList(await request('/blogs', { auth: false, query: { title, category: category === 'All' ? '' : category } })),
  getBlog: async (id) => blogObj(await request(`/blogs/${id}`, { auth: false })),
  // NOTE: userId is intentionally never sent – the backend reads it from the token.
  create: ({ blogTitle, blog, category }) => request('/blogs/create', { method: 'POST', body: { blogTitle, blog, category } }),
  update: (id, { blogTitle, blog, category }) => request(`/blogs/update/${id}`, { method: 'PUT', body: { blogTitle, blog, category } }),
  remove: (id) => request(`/blogs/delete/${id}`, { method: 'DELETE' }),
};
