import { request, pickList, pickObject } from '@/utils/api';

const userObj = (d) => pickObject(d, ['user', 'profile']);

export const userService = {
  getProfile: async () => userObj(await request('/users/profile')),
  updateProfile: ({ firstName, lastName }) => request('/users/profile/update', { method: 'PUT', body: { firstname: firstName, lastname: lastName } }),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request('/users/profile/image', { method: 'PATCH', formData });
  },
  changePassword: (password) => request('/users/password', { method: 'PATCH', body: { password } }),
  getUsers: async () => pickList(await request('/users')),
  getUser: async (id) => userObj(await request(`/users/${id}`)),
  setStatus: (id, isActive) => request(`/users/${id}/status`, { method: 'PATCH', body: { isActive } }),
};
