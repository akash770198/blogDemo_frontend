import { useEffect, useState } from 'react'
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from './api'

const initialForm = {
  title: '',
  content: '',
}

function App() {
  const [blogs, setBlogs] = useState([])
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs()
      setBlogs(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch blogs')
    }
  }

  const fetchBlogById = async (blogId) => {
    try {
      const blog = await getBlogById(blogId)
      setSelectedBlog(blog)
    } catch (err) {
      setError(err.message || 'Blog not found')
      setSelectedBlog(null)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (editingId) {
        await updateBlog(editingId, form)
      } else {
        await createBlog(form)
      }

      setForm(initialForm)
      setEditingId(null)
      await fetchBlogs()
      if (selectedBlog) {
        await fetchBlogById(selectedBlog.id)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (blog) => {
    setEditingId(blog.id)
    setSelectedBlog(blog)
    setForm({ title: blog.title, content: blog.content })
  }

  const handleDelete = async (blogId) => {
    try {
      await deleteBlog(blogId)
      setSelectedBlog(null)
      await fetchBlogs()
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-indigo-100">
            Edumentry Blog
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">Blog Dashboard</h1>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">{editingId ? 'Edit Blog' : 'Create New Blog'}</h2>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setSelectedBlog(null)
                    setForm(initialForm)
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter blog title"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
                <textarea
                  name="content"
                  rows="6"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write your blog content here..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Saving...' : editingId ? 'Update Blog' : 'Create Blog'}
              </button>
            </form>
          </section>

          <aside className="rounded-2xl bg-slate-900 p-6 text-white shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Blog Details</h2>

            {selectedBlog ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Blog ID</p>
                  <p className="text-lg font-semibold">#{selectedBlog.id}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Title</p>
                  <h3 className="text-xl font-bold text-white">{selectedBlog.title}</h3>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Content</p>
                  <p className="whitespace-pre-wrap leading-7 text-slate-200">{selectedBlog.content}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-slate-300">
                Select a blog to view details.
              </div>
            )}
          </aside>
        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold">All Blogs</h2>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={fetchBlogs}
                className="rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200"
              >
                Get All Blogs
              </button>
              <button
                type="button"
                onClick={() => {
                  const blogId = window.prompt('Enter blog ID:')
                  if (blogId) {
                    fetchBlogById(Number(blogId))
                  }
                }}
                className="rounded-lg bg-indigo-100 px-4 py-2 font-medium text-indigo-700 hover:bg-indigo-200"
              >
                Get Blog by ID
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {blogs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500 md:col-span-2 xl:col-span-3">
                No blogs available yet.
              </div>
            ) : (
              blogs.map((blog) => (
                <article key={blog.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Blog #{blog.id}</p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-800">{blog.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchBlogById(blog.id)}
                      className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      View
                    </button>
                  </div>

                  <p className="mb-4 line-clamp-4 text-sm leading-6 text-slate-600">{blog.content}</p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(blog)}
                      className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog.id)}
                      className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
