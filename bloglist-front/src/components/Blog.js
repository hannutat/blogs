import React, { useState } from "react";
import Proptypes from "prop-types";
import { Typography, Button, Stack, Container } from "@mui/material";
import { parseJSON  } from "date-fns";

const Blog = ( { blog, likeHandler, deleteHandler, loggedUser } ) => {
    const [fullInfoVisible, setFullInfoVisible] = useState(false);

    const time = parseJSON(blog.time);
    const timeString = `${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()} ${time.getHours()}.${time.getMinutes()}`;

    return(
        <Container className="blogMain" sx={{ border: "1px solid lightblue",
            borderRadius:"10px",
            marginBottom:"10px" }} >

            <Stack direction="row">
                <Typography variant="h6"
                    sx={{ marginLeft: "10px", marginTop: "8px" }}>{blog.title} by {blog.author}</Typography>

                <Button id="detailsButton" sx={{ marginLeft: "10px", marginTop:"6px" }} onClick={ () => setFullInfoVisible(!fullInfoVisible) }>
                    { fullInfoVisible
                        ? "Hide"
                        : "Details" }
                </Button>
            </Stack>

            { fullInfoVisible
                ? <Container>
                    <Typography>Author: {blog.author}</Typography>
                    <Typography>URL: {blog.url}</Typography>
                    <Typography>Added: {timeString}</Typography>
                    <Typography>Likes:
                        <span className="likes"> {blog.likes}</span>
                        <br/>
                    </Typography>

                    <div>
                        <Button id="likeButton"
                            variant="outlined"
                            onClick={ () => likeHandler(blog) }
                            sx={{ marginTop: "10px", marginRight: "10px", marginBottom: "10px" }}
                        >Like this post
                        </Button>

                        { loggedUser === blog.user.username
                            ? <Button id="deleteButton"
                                variant="outlined"
                                onClick={ () => deleteHandler(blog)}
                                sx={{ marginTop: "10px", marginRight: "10px", marginBottom: "10px" }}
                            >Remove
                            </Button>
                            : <></>
                        }
                    </div>
                </Container>
                : <></>
            }
        </Container>
    );
};

Blog.propTypes = {
    blog: Proptypes.object.isRequired,
    likeHandler: Proptypes.func.isRequired,
    deleteHandler: Proptypes.func.isRequired,
    loggedUser: Proptypes.string
};

export default Blog;