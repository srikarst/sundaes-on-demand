import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScoopOption from "../ScoopOption";

test("input box turns red for invalid scoop count", async () => {
  render(<ScoopOption name="" imagePath="" updateItemCount={jest.fn()} />);

  const input = screen.getByRole("spinbutton");
  userEvent.clear(input);
  userEvent.type(input, "-1");
  expect(input).toHaveClass("is-invalid");

  userEvent.clear(input);
  userEvent.type(input, "2.5");
  expect(input).toHaveClass("is-invalid");

  userEvent.clear(input);
  userEvent.type(input, "11");
  expect(input).toHaveClass("is-invalid");

  userEvent.clear(input);
  userEvent.type(input, "3");
  expect(input).not.toHaveClass("is-invalid");
});
