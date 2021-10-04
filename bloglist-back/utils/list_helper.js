const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    let total = blogs.reduce( (previous, current) => {
        return previous + current.likes;
    }, 0);
    
    return total;
}

const favoriteBlog = (blogs) => {
    let mostLikesIndex;

    blogs.reduce( (prev, cur, idx) => {
        if (cur.likes > prev) {
            mostLikesIndex = idx;
            return cur.likes;
        } else {
            return prev;
        }
    }, 0)

    return blogs[mostLikesIndex];
}

const mostBlogs = (blogs) => {
    let authorList = [];

    blogs.forEach( (blog) => {
        let authorIndex = authorList.findIndex( (curAuthor) => {
            return curAuthor.author === blog.author;
        })

        if (authorIndex > -1) {
            authorList[authorIndex].blogCount += 1;
        } else {
            authorList.push({ author: blog.author, blogCount: 1})
        }
    });

    let mostBlogsAuthorIndex;

    authorList.reduce( (prev, cur, idx) => {
        if (cur.blogCount > prev) {
            mostBlogsAuthorIndex = idx;
            return cur.blogCount;
        } else {
            return prev;
        }
    }, 0)

    return authorList[mostBlogsAuthorIndex];
}

const mostLikes = (blogs) => {
    let authorList = [];

    blogs.forEach( (blog) => {
        let authorIndex = authorList.findIndex( (curAuthor) => {
            return curAuthor.author === blog.author;
        })

        if (authorIndex > -1) {
            authorList[authorIndex].likes += blog.likes;
        } else {
            authorList.push({ author: blog.author, likes: blog.likes})
        }
    });

    let mostLikesAuthorIndex;

    authorList.reduce( (prev, cur, idx) => {
        if (cur.likes > prev) {
            mostLikesAuthorIndex = idx;
            return cur.likes;
        } else {
            return prev;
        }
    }, 0)

    return authorList[mostLikesAuthorIndex];
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };