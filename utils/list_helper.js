const dummy = (blog_array) => {
    return 1
}

const totalLikes = (blog_array) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blog_array.length === 0
        ? 0
        : blog_array.reduce(reducer, 0)
}

const favouriteBlog = (blog_array) => {
    var most_likes = 0

    
    blog_array.forEach(blog => {
        return blog.likes > most_likes
        ? most_likes = blog.likes
        : most_likes
    })
    
    return blog_array.length === 0
        ? null    
        : blog_array.find(blog => blog.likes === most_likes)
}

const mostBlogs = (blog_array) => {
    if (blog_array.length === 0) {
        return null
    }
        
    var most_blogs = 0
    var author = ""

    blog_array.forEach(blog => {
        const author_blogs = blog_array.filter(filtered => filtered.author === blog.author)

        if (author_blogs.length > most_blogs) {
            author = blog.author
            most_blogs = author_blogs.length
        }
    })

    return {
        author: author,
        blogs: most_blogs
    }
}

const mostLikes = (blog_array) => {
    if (blog_array.length === 0) {
        return null
    }
        
    var most_likes = 0
    var author = ""

    blog_array.forEach(blog => {
        // filter list to array of only that author's blogs
        const author_blogs = blog_array.filter(filtered => filtered.author === blog.author)
        const reducer = (sum, item) => {
            return sum + item.likes
        }

        // get total number of likes on that author's blogs
        const author_likes = author_blogs.reduce(reducer, 0)

        // if greater than the current most, set variables
        if (author_likes > most_likes) {
            author = blog.author
            most_likes = author_likes
        }
    })

    return {
        author: author,
        likes: most_likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}