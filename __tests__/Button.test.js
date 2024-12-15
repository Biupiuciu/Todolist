import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "../src/components/Button";

describe("Button component", () => {
  it("renders the button with the correct label", () => {
    render(<Button value="Click me" />);

    // Check if the button with the correct text is rendered
    const buttonElement = screen.getByText(/Click me/i);
    expect(buttonElement).toBeInTheDocument();
  });
});
