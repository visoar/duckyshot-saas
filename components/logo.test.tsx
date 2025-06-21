import { render } from "@testing-library/react";
import { Logo } from "./logo";
import { Cuboid } from "lucide-react";

describe("Logo", () => {
  it("renders with default variant and icon", () => {
    const { container } = render(<Logo />);
    
    const logoContainer = container.firstChild as HTMLElement;
    expect(logoContainer).toBeInTheDocument();
    expect(logoContainer).toHaveClass("flex", "items-center", "justify-center", "h-full", "w-full", "rounded-lg", "bg-primary", "p-2.5");
  });

  it("renders with custom icon", () => {
    const { container } = render(<Logo icon={Cuboid} />);
    
    const logoContainer = container.firstChild as HTMLElement;
    expect(logoContainer).toBeInTheDocument();
  });

  it("renders with minimal variant", () => {
    const { container } = render(<Logo variant="minimal" />);
    
    const logoContainer = container.firstChild as HTMLElement;
    expect(logoContainer).toHaveClass("rounded-md", "bg-primary/10", "p-2");
  });

  it("renders with icon-only variant", () => {
    const { container } = render(<Logo variant="icon-only" />);
    
    const logoContainer = container.firstChild as HTMLElement;
    expect(logoContainer).toHaveClass("h-full", "w-full");
    expect(logoContainer).not.toHaveClass("bg-primary", "rounded-lg");
  });

  it("applies custom className", () => {
    const { container } = render(<Logo className="custom-class" />);
    
    const logoContainer = container.firstChild as HTMLElement;
    expect(logoContainer).toHaveClass("custom-class");
  });

  it("applies custom iconClassName", () => {
    const { container } = render(<Logo iconClassName="custom-icon-class" />);
    
    const logoContainer = container.firstChild as HTMLElement;
    const icon = logoContainer.querySelector('svg');
    expect(icon).toHaveClass("custom-icon-class");
  });
});