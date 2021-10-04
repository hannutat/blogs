import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

// eslint-disable-next-line no-unused-vars
const blog = {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 49,
    user: {
        username: "master",
        name: "Testimestari",
        id: "6148c6ecc887f624ec004f72"
    },
    id: "6148c6ecc887f624ec004f78"
};

const likeHandler = () => { null; };
const deleteHandler = () => { null; };

test("Renders blog title and author, but no likes or url", () => {
    const component = render(
        <Blog blog={blog} likeHandler={likeHandler} deleteHandler={deleteHandler} />
    );

    expect(component.container).toHaveTextContent("Go To Statement Considered Harmful");
    expect(component.container).toHaveTextContent("Edsger W. Dijkstra");
    expect(component.container).not.toHaveTextContent("http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html");
    expect(component.container).not.toHaveTextContent("Likes");
});

test("Renders url and like after pressing details button", () => {
    const component = render(
        <Blog blog={blog} likeHandler={likeHandler} deleteHandler={deleteHandler} />
    );

    const detailsButton = component.getByText("Details");
    fireEvent.click(detailsButton);

    expect(component.container).toHaveTextContent("Go To Statement Considered Harmful");
    expect(component.container).toHaveTextContent("Edsger W. Dijkstra");
    expect(component.container).toHaveTextContent("http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html");
    expect(component.container).toHaveTextContent("Likes: 49");
});

test("If like pressed 2 times, likeHandler gets called 2 times", () => {
    const mockLikeHandler = jest.fn();

    const component = render(
        <Blog blog={blog} likeHandler={mockLikeHandler} deleteHandler={deleteHandler} />
    );

    const detailsButton = component.getByText("Details");
    fireEvent.click(detailsButton);

    const likeButton = component.getByText("Like this post");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockLikeHandler.mock.calls.length).toBe(2);
});