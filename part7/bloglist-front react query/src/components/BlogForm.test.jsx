// Make a test for the new blog form. The test should check,
// that the form calls the event handler it received as props
// with the right details when a new blog is created.

import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("updatees parent form and calls onSubmit", async () => {
  const mockCreateBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={mockCreateBlog} />);

  const titleAuthorUrl = screen.getAllByRole("textbox");
  await user.type(titleAuthorUrl[0], "Timmy blog 1");
  await user.type(titleAuthorUrl[1], "Tim");
  await user.type(titleAuthorUrl[2], "www.tim.com");

  const postButton = screen.getByText("create");
  await user.click(postButton);

  expect(mockCreateBlog.mock.calls).toHaveLength(1);

  console.log("timscontent:", mockCreateBlog.mock.calls);
  expect(mockCreateBlog.mock.calls[0][0].author).toBe("Tim");
});
