import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response;
};

const postNewBlog = async (newBlog, token) => {
    const response = await axios({
        method: "post",
        url: baseUrl,
        headers : { "Authorization" : `bearer ${token}` },
        data: newBlog
    });

    return response.data;
};

const likeBlog = async (newBlog) => {

    const requestBlog = { ...newBlog, user: newBlog.user.id };

    const response = await axios({
        method: "put",
        url: `${baseUrl}/${requestBlog.id}`,
        data: requestBlog
    });

    return response.data;
};

const removeBlog = async (blogId, token) => {

    const response = await axios({
        method: "delete",
        url: `${baseUrl}/${blogId}`,
        headers : { "Authorization" : `bearer ${token}` }
    });

    return response;
};

const blogService = { getAll, postNewBlog, likeBlog, removeBlog };

export default blogService;