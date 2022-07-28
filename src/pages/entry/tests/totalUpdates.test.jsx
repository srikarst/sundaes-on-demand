import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", {
    exact: false,
  });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoops to 1 and check the sub-total
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2 and check the sub-total

  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("update toppings subtotal when topppings change", async () => {
  render(<Options optionType="toppings" />);

  const toppingsSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent("0.00");

  const cherriesInput = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  userEvent.click(cherriesInput);
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  const hotFudgeInput = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });
  userEvent.click(hotFudgeInput);
  expect(toppingsSubtotal).toHaveTextContent("3.00");
  userEvent.click(hotFudgeInput);
  expect(toppingsSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("grand total updates properly if scoop is added first", async () => {
    render(<OrderEntry />);

    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    expect(grandTotal).toHaveTextContent("0.00");

    const cherriesInput = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    userEvent.click(cherriesInput);
    expect(grandTotal).toHaveTextContent("1.50");

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "1");

    expect(grandTotal).toHaveTextContent("3.50");
  });
  test("grand total updates properly if topping is added first", async () => {
    render(<OrderEntry />);

    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });

    const chocolateInput = await screen.findByRole("spinbutton", {
      name: "Chocolate",
    });
    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, "2");
    expect(grandTotal).toHaveTextContent("4.00");

    const hotFudgeInput = await screen.findByRole("checkbox", {
      name: "Hot fudge",
    });
    userEvent.click(hotFudgeInput);
    expect(grandTotal).toHaveTextContent("5.50");
  });
  test("grand total updates if item is removed", async () => {
    render(<OrderEntry />);

    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });

    const cherriesInput = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    userEvent.click(cherriesInput);
    expect(grandTotal).toHaveTextContent("1.50");

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");

    expect(grandTotal).toHaveTextContent("5.50");

    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "1");
    expect(grandTotal).toHaveTextContent("3.50");

    userEvent.click(cherriesInput);
    expect(grandTotal).toHaveTextContent("2.00");
  });
});
