import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

describe("<Blog />", () => {
  const mockBlog = {
    title: "dan's blog",
    author: "danny",
    url: "www.dan.com",
    likes: 3,
    id: 123,
  };

  const user = {
    blogs: [{ user: "123" }],
  };

  test("renders title and author but not url or likes by default", () => {
    const { container } = render(<Blog blog={mockBlog} />);

    // Check that the title and author are visible
    const titleAuthor = container.querySelector(".blog-title-author");

    expect(titleAuthor).toHaveTextContent("dan's blog dan");
    expect(titleAuthor).not.toHaveTextContent("www.dan.com");
    expect(titleAuthor).not.toHaveTextContent("Likes: 3");
  });

  test("on expand, checks that the blogs URL and number of likes are shown", async () => {
    render(<Blog blog={mockBlog} />);

    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const blogUrlDiv = screen.getByTestId("blog-url");
    const blogLikesDiv = screen.getByTestId("blog-likes");

    expect(blogUrlDiv).toHaveTextContent("www.dan.com");
    expect(blogLikesDiv).toHaveTextContent("3");
  });

  test("likes clicked twice", async () => {
    const mockUpdateTheLikes = vi.fn();
    const userInstance = userEvent.setup();

    render(<Blog blog={mockBlog} updateTheLikeCount={mockUpdateTheLikes} />);

    const likeButton = screen.getByTestId("like-button");
    expect(likeButton).toHaveTextContent("like");

    await userInstance.click(likeButton);
    await userInstance.click(likeButton);
    console.log("blogCALL?:", mockUpdateTheLikes.mock.calls);

    expect(mockUpdateTheLikes.mock.calls).toHaveLength(2);

    // try other tests here??? test out mockHandler with previous test?
  });
});

// Make a test, which ensures that if the like button is clicked twice,
// the event handler the component received as props is called twice
