import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

test("order phases for happy path", async () => {
  // render app
  render(<App />);

  // add ice cream scoops and toppings
  const cherriesInput = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  userEvent.click(cherriesInput);

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");

  const chocolateInput = screen.getByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");

  // find and click order button
  const orderSummaryButton = screen.getByRole("button", {
    name: /order sundae/i,
  });
  userEvent.click(orderSummaryButton);

  // check summary information based on order
  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole("heading", {
    name: "Toppings: $1.50",
  });
  expect(toppingsHeading).toBeInTheDocument();

  const optionItems = screen.getAllByRole("listitem");
  const optionItemsText = optionItems.map((item) => item.textContent);
  expect(optionItemsText).toEqual(["1 Vanilla", "2 Chocolate", "Cherries"]);

  // accept terms and confirmations and click button to confirm order

  const tcCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  userEvent.click(tcCheckbox);
  const confirmOrderButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  userEvent.click(confirmOrderButton);

  const loadingText = screen.getByText("Loading");
  expect(loadingText).toBeInTheDocument();

  // confirm order number on confirmation page
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // click "new order" button on confirmation page
  const newOrderButton = screen.getByRole("button", { name: /new order/i });
  userEvent.click(newOrderButton);

  // check that scoops and subtotals have been reset
  const scoopsTotal = screen.getByText("Scoops total: $0.00");
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = screen.getByText("Toppings total: $0.00");
  expect(toppingsTotal).toBeInTheDocument();

  // do we need to await anything to avoid test errors?
  await screen.findByRole("spinbutton", { name: "Vanilla" });
  await screen.findByRole("checkbox", { name: "Cherries" });
});

test("Toppings header is not on summary page if no toppings ordered", async () => {
  // render app
  render(<App />);

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");

  const chocolateInput = screen.getByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");

  // find and click order button
  const orderSummaryButton = screen.getByRole("button", {
    name: /order sundae/i,
  });
  userEvent.click(orderSummaryButton);

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole("heading", {
    name: /toppings/i,
  });
  expect(toppingsHeading).not.toBeInTheDocument();
});
