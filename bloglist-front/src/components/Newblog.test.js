import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Newblog from "./Newblog";

test("New blog form passes correct information to handler function", () => {
    const mockNewPostHandler = jest.fn();

    const component = render(
        <Newblog newPostHandler={mockNewPostHandler}/>
    );

    const titleInput = component.getByTitle("newTitle").querySelector("input");
    const urlInput = component.getByTitle("newUrl").querySelector("input");
    const newBlogForm = component.container.querySelector("form");

    fireEvent.change(titleInput, { target:
        { value: "Testing title 1" }
    });

    fireEvent.change(urlInput, { target:
        { value: "Url1" }
    });

    fireEvent.submit(newBlogForm);

    const date = new Date();
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    expect(mockNewPostHandler.mock.calls[0][0].title).toBe("Testing title 1");
    expect(mockNewPostHandler.mock.calls[0][0].url).toBe("Url1");
    expect(mockNewPostHandler.mock.calls[0][0].author).toBe("currentuser");

    const dateToTest = mockNewPostHandler.mock.calls[0][0].time;
    let dateToTestString = `${dateToTest.getFullYear()}-${dateToTest.getMonth() + 1}-${dateToTest.getDate()}`;
    dateToTestString = dateToTestString.substring(0, 10);

    expect(dateToTestString).toEqual(dateString);
});