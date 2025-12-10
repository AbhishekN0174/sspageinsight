import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { getAllBlogs } from '../data/blogPosts'
import { useAnalytics } from '../hooks/useAnalytics'

const BlogCard = ({ post, index, analytics }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="premium-card p-1"
    >
      <Link
        to={`/blog/${post.slug}`}
        className="block h-full"
        onClick={() =>
          analytics?.trackLink?.('Blog Card Click', `/blog/${post.slug}`, {
            post_id: post.id,
            category: post.category,
          })
        }
      >
        <div className="relative h-full overflow-hidden rounded-[22px] bg-white group cursor-pointer">
          {/* Image */}
          <div className="relative overflow-hidden h-56">
            <motion.img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-sm text-petal-600 border border-petal-200">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Date */}
            {post.date && (
              <time className="text-sm text-gray-500 font-medium">
                {post.date} {post.readTime && `• ${post.readTime}`}
              </time>
            )}

            {/* Title */}
            <h3 className="font-heading font-bold text-gray-900 mb-3 mt-2 text-xl md:text-2xl group-hover:text-petal-600 transition-colors">
              {post.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-6 line-clamp-3">
              {post.description}
            </p>

            {/* Read More Link */}
            <div className="inline-flex items-center gap-2 text-petal-600 font-semibold group-hover:text-petal-700 transition-colors">
              Read Article
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(244, 143, 180, 0.08), transparent 70%)'
            }}
          />
        </div>
      </Link>
    </motion.article>
  )
}

const BlogPage = () => {
  const blogPosts = getAllBlogs()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })
  const analytics = useAnalytics('Blog')

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-white via-petal-50/30 to-white overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-petal-200/30 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full filter blur-[120px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(rgba(244, 143, 180, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 143, 180, 0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full glass text-sm font-semibold mb-6 text-petal-700"
            whileHover={{ scale: 1.05 }}
          >
            Our Blog
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            Latest <span className="text-gradient">Stories</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert insights, community stories, and the latest trends in fitness and wellness
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              index={index}
              analytics={analytics}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogPage

