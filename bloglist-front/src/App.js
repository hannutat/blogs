import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import Newblog from "./components/Newblog";
import { Typography, Container, Button, TextField, Stack, Snackbar } from "@mui/material";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState();
    const [snackVisible, setSnackVisible] = useState();
    const newBlogRef = useRef();

    useEffect(() => {
        const getAllBlogs = async () => {
            const response = await blogService.getAll();
            setBlogs(response.data);
        };

        getAllBlogs();

    }, [user]);

    useEffect(() => {
        if (window.localStorage.getItem("loggedUser")) {
            const user = JSON.parse(window.localStorage.getItem("loggedUser"));
            setUser(user);
        }
    }, []);

    useEffect(() => {
        if (message) {
            setSnackVisible(true);
        } else {
            setSnackVisible(false);
        }
    }, [message]);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const userResponse = await loginService.login( { username, password } );
            window.localStorage.setItem("loggedUser", JSON.stringify(userResponse));
            setUser(userResponse);
            setUsername("");
            setPassword("");
            setMessage("Login successful!");
        } catch (error) {
            setMessage("Invalid username or password");
        }
        setTimeout( () => { setMessage(""); }, 5000);
    };

    const handleLogout = () => {
        window.localStorage.removeItem("loggedUser");
        setUser(null);
    };

    const newPostHandler = async (newBlog) => {
        try {
            let blogResponse = await blogService.postNewBlog(newBlog, user.token);

            if (blogResponse.title) {
                const userObject = { id: blogResponse.user, name: user.name, username: user.username };
                blogResponse.user = userObject;
                const newBlogList = blogs.concat(blogResponse);

                setBlogs(newBlogList);
                newBlogRef.current.toggleVisibility();
                setMessage(`New blog "${blogResponse.title}" added succesfully!`);
            }

        } catch (error) {
            setMessage("Adding a blog failed.");
        }
        setTimeout( () => { setMessage(""); }, 5000);
    };

    const likeHandler = async (newBlog) => {
        const updatedBlog = { ...newBlog, likes: (newBlog.likes + 1) };

        try {
            const blogResponse = await blogService.likeBlog(updatedBlog);

            if (blogResponse.likes) {
                let newBlogList = [...blogs];
                const idxOfCurrent = newBlogList.findIndex( blog => blog.id === updatedBlog.id );
                newBlogList.splice(idxOfCurrent, 1, updatedBlog);
                setBlogs(newBlogList);
            }

        } catch (error) {
            setMessage("Something unexpected happened.");
            setTimeout( () => { setMessage(""); }, 5000);
        }
    };

    const deleteHandler = async (blog) => {
        const blogId = blog.id;

        if (window.confirm(`Delete blog titled: ${blog.title} ?`)) {
            try {

                const blogResponse = await blogService.removeBlog(blogId, user.token);

                if (blogResponse.status === 204) {
                    const newBlogList = blogs.filter( blog => blog.id !== blogId );
                    setBlogs(newBlogList);
                    setMessage("Blog removed.");
                }

            } catch (error) {
                setMessage("Something unexpected happened.");
            }
            setTimeout( () => { setMessage(""); }, 5000);
        }
    };

    const loginForm = () => {
        return(
            <div>
                { user !== null
                    ? <Container sx={{ margin: "10px" }}>
                        <Typography variant="body1">{user.name} logged in.
                            <Button id="logoutButton"
                                variant="contained"
                                size="small"
                                onClick={handleLogout}
                                sx={{ marginLeft: "10px", marginBottom: "2px" }}
                            >Logout
                            </Button>
                        </Typography>
                    </Container>
                    : <></>
                }

                { user === null
                    ? <form onSubmit={handleLogin}>
                        <Stack direction="row" sx={{ margin: "10px" }}>
                            <Typography sx={{ marginRight: "10px", marginTop: "7px" }}>Username</Typography>
                            <TextField type="text"
                                size="small"
                                value={username}
                                name="Username"
                                id="loginUsername"
                                onChange={ ( { target } ) => setUsername(target.value) }
                                sx={{ marginRight: "5px", maxWidth: "150px" }}
                            />
                            <Typography sx={{ marginLeft: "10px", marginRight: "10px", marginTop: "7px" }}>Password</Typography>
                            <TextField type="password"
                                size="small"
                                value={password}
                                name="Password"
                                id="loginPassword"
                                onChange={ ( { target } ) => setPassword(target.value) }
                                sx={{ maxWidth: "150px" }}
                            />
                            <Button type="submit" id="loginButton">Login</Button>
                        </Stack>
                    </form>
                    : <></>
                }
                <hr/>
                <br></br>
            </div>
        );
    };

    const blogList = () => {
        return(
            <Container>
                {blogs.sort ( (element1, element2) => element2.likes - element1.likes )
                    .map( blog =>
                        <Blog key={blog.id}
                            blog={blog}
                            likeHandler={likeHandler}
                            deleteHandler={deleteHandler}
                            loggedUser={user.username}
                        />)}
            </Container>
        );
    };

    return (
        <Container maxWidth="md">
            <Container sx={{ bgcolor: "primary.light" }}>
                <Typography variant="h3" align="center" sx={{ color: "white", padding: "15px" }}>Blogs</Typography>
            </Container>
            { loginForm()}
            { user !== null
                ? <div>
                    { blogList() }
                    <br/>
                    <Container>
                        <Togglable buttonLabel="Add new blog" ref={newBlogRef}>
                            <Newblog newPostHandler={newPostHandler}/>
                        </Togglable>
                    </Container>
                </div>
                : <div></div>
            }
            <Snackbar open={snackVisible}
                message={message}
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
            </Snackbar>

        </Container>
    );
};

export default App;