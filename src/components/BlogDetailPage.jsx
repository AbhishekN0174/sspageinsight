import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getBlogBySlug, getAllBlogs } from '../data/blogPosts'
import { useAnalytics } from '../hooks/useAnalytics'

const BlogDetailPage = () => {
  const { slug } = useParams()
  const post = getBlogBySlug(slug)
  const allBlogs = getAllBlogs()
  const analytics = useAnalytics(post ? 'Blog Detail' : 'Blog Detail - Missing', {
    slug,
    post_id: post?.id,
  })

  if (!post) {
    return (
      <section className="relative py-24 md:py-32 min-h-screen bg-gradient-to-b from-white via-petal-50/30 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-heading font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link
              to="/blog"
              onClick={() =>
                analytics?.trackLink?.('Blog Detail - Back to List', '/blog', {
                  slug,
                  post_id: post?.id,
                })
              }
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-primary text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Get related posts (exclude current post)
  const relatedPosts = allBlogs
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3)

  return (
    <section className="relative py-24 md:py-32 min-h-screen bg-gradient-to-b from-white via-petal-50/30 to-white">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-petal-200/30 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full filter blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            onClick={() =>
              analytics?.trackLink?.('Blog Detail - Back', '/blog', {
                slug,
                post_id: post?.id,
              })
            }
            className="inline-flex items-center gap-2 text-gray-600 hover:text-petal-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Header Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-8 md:mb-12"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-6 left-6 z-10">
              <span className="px-4 py-2 text-sm font-semibold rounded-full bg-white/90 backdrop-blur-sm text-petal-600 border border-petal-200">
                {post.category}
              </span>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
          >
            {/* Meta Information */}
            <div className="mb-8 pb-8 border-b border-petal-100">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <time className="text-sm md:text-base font-medium">
                  {post.date}
                </time>
                {post.readTime && (
                  <>
                    <span>•</span>
                    <span className="text-sm md:text-base">{post.readTime}</span>
                  </>
                )}
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => {
                // Check if it's a heading
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2
                      key={index}
                      className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mt-12 mb-6 first:mt-0"
                    >
                      {paragraph.replace('## ', '')}
                    </h2>
                  )
                }
                // Check if it's a subheading
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3
                      key={index}
                      className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mt-8 mb-4"
                    >
                      {paragraph.replace('### ', '')}
                    </h3>
                  )
                }
                // Check if it's a list item
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 my-6 text-gray-700">
                      {paragraph.split('\n').filter(line => line.startsWith('- ')).map((item, i) => (
                        <li key={i} className="text-base md:text-lg leading-relaxed">
                          {item.replace('- ', '').replace('**', '').replace('**', '')}
                        </li>
                      ))}
                    </ul>
                  )
                }
                // Regular paragraph
                if (paragraph.trim()) {
                  return (
                    <p
                      key={index}
                      className="text-base md:text-lg text-gray-700 leading-relaxed mb-6"
                    >
                      {paragraph}
                    </p>
                  )
                }
                return null
              })}
            </div>
          </motion.article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    onClick={() =>
                      analytics?.trackLink?.(
                        'Blog Detail - Related Article Click',
                        `/blog/${relatedPost.slug}`,
                        {
                          slug,
                          post_id: post?.id,
                          related_post_id: relatedPost.id,
                        },
                      )
                    }
                    className="group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-sm text-petal-600 border border-petal-200">
                            {relatedPost.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading font-bold text-gray-900 mb-2 group-hover:text-petal-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-500">{relatedPost.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back to Blog Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Link
              to="/blog"
            onClick={() =>
              analytics?.trackLink?.('Blog Detail - Back to All Articles', '/blog', {
                slug,
                post_id: post?.id,
              })
            }
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass hover:glass-strong transition-all font-semibold text-gray-900 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Articles
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default BlogDetailPage

