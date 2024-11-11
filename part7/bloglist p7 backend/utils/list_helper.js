const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}


const favoriteBlog = (blogs) => {
  let highestLikeNum = 0
  let faveBlog = null

  if (blogs.length === 0) {
    return null
  }
  blogs.forEach(blog => {
    if (blog.likes > highestLikeNum) {
      faveBlog = blog,
      highestLikeNum = blog.likes
    }
  })
  return faveBlog
}


const mostBlogs = (blogs) => {
  const blogLog = []

  blogs.forEach(blog => {
    const author = blog.author

    const authorEntry = blogLog.find(entry => entry.author === author)
    if (authorEntry) {
      authorEntry.blogs += 1
    } else {
      blogLog.push({ "author": author, "blogs": 1 })
    }
  })

  if (blogLog.length === 0) {
    return null
  }

  let biggestBlogger = null
  let biggestBlogCount = 0

  blogLog.forEach(entry => {
    if (entry.blogs > biggestBlogCount) {
      biggestBlogger = entry.author
      biggestBlogCount = entry.blogs
    }
  })
  return { "author": biggestBlogger, "blogs": biggestBlogCount }
}


const mostLikes = (blogs) => {
  let likeCounter = 0
  let likedAuthor = null

  blogs.forEach(blog => {
    if (blog.likes > likeCounter) {
      likeCounter = blog.likes
      likedAuthor = blog.author
    }
  })
  return { "author": likedAuthor, "likes": likeCounter }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}


// const average = (array) => {
//     const reducer = (sum, item) => {
//       return sum + item
//     }
//     return array.length === 0
//       ? 0
//       : array.reduce(reducer, 0) / array.length
//   }


// practice:
// const mostBlogs = (blogs) => {
//   let blogCountArray = []

//   blogs.forEach(blog => {
//     const author = blog.author

//     const authorEntry = blogCountArray.find(entry => entry.author === author)

//     if (authorEntry) {
//       authorEntry.blogs += 1
//     } else {
//       blogCountArray.push({ "author": author, "blogs": 1 })
//     }
//   })

//   if (blogCountArray.length === 0) {
//     return null
//   }

//   let biggestBlogger = null
//   let biggestBloggerCount = 0

//   blogCountArray.forEach(entry => {
//     if (entry.blogs > biggestBloggerCount) {
//       biggestBlogger = entry.author
//       biggestBloggerCount = entry.blogs
//     }
//   })
//   return {
//     "author": biggestBlogger,
//     "blogs": biggestBloggerCount
//   }
// }