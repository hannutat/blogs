import React, { useState } from "react";
import Proptypes from "prop-types";
import { Typography, Button, Container, TextField, Stack } from "@mui/material";

const Newblog = ( { newPostHandler } ) => {
    const [newBlogTitle, setNewBlogTitle] = useState([]);
    const [newBlogUrl, setNewBlogUrl] = useState([]);

    const submitHandler = (event) => {
        event.preventDefault();

        //blog author filled in based on logged in user
        const newBlogAuthor = "currentuser";

        const newBlog = { title: newBlogTitle, url: newBlogUrl, author: newBlogAuthor, time: new Date() };
        newPostHandler(newBlog);
    };

    return(
        <Container sx={{ border: "1px solid lightblue",
            borderRadius:"10px",
            marginBottom:"10px",
            marginTop: "15px" }}>

            <br/>
            <Typography variant="h5" sx={{ marginBottom:"15px" }}>Create a new post</Typography>
            <form onSubmit={submitHandler}>
                <Stack direction="row">
                    <Typography sx={{ marginTop: "10px", marginRight: "15px", marginBottom: "15px" }}>Title</Typography>
                    <TextField type="text"
                        value={newBlogTitle}
                        title="newTitle"
                        id="newTitle"
                        onChange={ ( { target } ) => setNewBlogTitle(target.value) }
                        size="small"
                    />
                </Stack>
                <Stack direction="row">
                    <Typography sx={{ marginTop: "10px", marginRight: "17px", marginBottom: "15px" }}>URL</Typography>
                    <TextField type="text"
                        value={newBlogUrl}
                        title="newUrl"
                        id="newUrl"
                        onChange={ ( { target } ) => setNewBlogUrl(target.value) }
                        size="small"
                    />
                </Stack>
                <Button sx={{ marginTop:"15px", marginBottom: "15px" }} variant="contained" type="submit" id="submitButton">Submit</Button>
            </form>
        </Container>
    );
};

Newblog.propTypes = {
    newPostHandler: Proptypes.func.isRequired
};

export default Newblog;