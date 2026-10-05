const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Request failed');
  }

  return response.json();
}

export async function getBlogs() {
  const response = await fetch(`${API_URL}/blogs/`);
  return handleResponse(response);
}

export async function getBlogById(blogId) {
  const response = await fetch(`${API_URL}/blogs/${blogId}`);
  return handleResponse(response);
}

export async function createBlog(blogData) {
  const response = await fetch(`${API_URL}/blogs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blogData),
  });

  return handleResponse(response);
}

export async function updateBlog(blogId, blogData) {
  const response = await fetch(`${API_URL}/blogs/${blogId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blogData),
  });

  return handleResponse(response);
}

export async function deleteBlog(blogId) {
  const response = await fetch(`${API_URL}/blogs/${blogId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Delete failed');
  }

  return response.json();
}
