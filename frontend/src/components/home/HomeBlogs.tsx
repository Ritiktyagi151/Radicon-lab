'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { User, Eye, MessageSquare, ArrowRight } from 'lucide-react'

const blogs = [
  {
    id: 1,
    date: "20 February",
    title: "Equipping Researchers in the Developing World",
    author: "Admin",
    views: 275,
    comments: 300,
    tags: ["Equipment", "Sass"],
    image: "/product-radicon/ACICLOCON 200.jpg",
  },
  {
    id: 2,
    date: "20 February",
    title: "Patient experience better Health Your Doctor Wishes",
    author: "Admin",
    views: 275,
    comments: 300,
    tags: ["Equipment", "Sass"],
    image: "/product-radicon/Alumnicon-500.jpg",
  },
  {
    id: 3,
    date: "20 February",
    title: "Standards of treatment Improved Detection of Disease",
    author: "Admin",
    views: 275,
    comments: 300,
    tags: ["Equipment", "Sass"],
    image: "/product-radicon/Losarad-50.jpg",
  }
]

export default function BlogSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="floating-panel mx-auto max-w-7xl rounded-lg px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-[#111111] mb-4">
            From our blog list <span className="text-gray-600">Latest News</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Our doctors include highly qualified male and female practitioners who come from a range of backgrounds and bring a diversity of skills.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div 
              key={blog.id}
              initial={{ opacity: 0, y: 34, rotateY: -4 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ delay: index * 0.1, duration: 0.55, ease: 'easeOut' }}
              whileHover={{ y: -12, rotateX: 4, rotateY: index % 2 === 0 ? -4 : 4, scale: 1.02 }}
              // overflow-hidden yahan move kiya hai taaki image zoom card se bahar na jaye
              className="bg-white rounded-sm shadow-sm group border border-gray-100 overflow-hidden transition-colors hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100/70 [transform-style:preserve-3d]"
            >
              {/* Image Container - overflow-hidden yahan se hata diya hai taaki date upar dikhe */}
              <div className="relative">
                <div className="overflow-hidden"> {/* Image zoom ke liye extra wrapper */}
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-[250px] object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                
                {/* Overlapping Date Label - z-50 aur absolute position fix */}
                <div className="absolute bottom-0 left-4 translate-y-1/2 bg-white px-4 py-1.5 shadow-md z-50 rounded-sm">
                  <span className="text-sm font-semibold text-gray-800">{blog.date}</span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 pt-10 bg-white">
                <h3 className="text-xl font-bold text-[#111111] mb-6 line-clamp-2 hover:text-blue-700 cursor-pointer transition-colors">
                  {blog.title}
                </h3>

                {/* Meta Information (Icons) */}
                <div className="flex items-center gap-4 text-gray-500 text-sm border-b border-gray-100 pb-6 mb-6">
                  <div className="flex items-center gap-1.5">
                    <User size={16} className="text-blue-500" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye size={16} className="text-blue-500" />
                    <span>{blog.views}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={16} className="text-blue-500" />
                    <span>{blog.comments}</span>
                  </div>
                </div>

                {/* Tags and Arrow Button */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {blog.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="bg-[#f0f4f8] text-gray-600 text-xs font-medium px-3 py-1.5 rounded-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-[#F0F8FF] text-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-100 transition-colors hover:bg-blue-600 hover:text-white"
                  >
                    <ArrowRight size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
