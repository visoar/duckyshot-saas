import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useTheme } from "next-themes";
import { ModeToggle } from "./mode-toggle";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe("ModeToggle Component", () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
      themes: ["light", "dark", "system"],
      systemTheme: "light",
      resolvedTheme: "light",
    });
  });

  it("should render loading state when not mounted", () => {
    // Mock the component before it's mounted (useEffect hasn't run)
    render(<ModeToggle />);
    const button = screen.getByRole("button");
    // Initially the button should be disabled until mounted
    expect(button).toBeInTheDocument();
  });

  it("should render with default props", async () => {
    render(<ModeToggle />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });
  });

  it("should apply custom className", async () => {
    const customClass = "custom-toggle-class";
    render(<ModeToggle className={customClass} />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveClass(customClass);
    });
  });

  it("should render with different variants", async () => {
    const { rerender } = render(<ModeToggle variant="ghost" />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    rerender(<ModeToggle variant="default" />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  it("should render with different sizes", async () => {
    const { rerender } = render(<ModeToggle size="sm" />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    rerender(<ModeToggle size="lg" />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  it("should show theme label when showLabel is true", async () => {
    render(<ModeToggle showLabel={true} />);
    await waitFor(() => {
      expect(screen.getByText("Light")).toBeInTheDocument();
    });
  });

  it("should not show label when showLabel is false", async () => {
    render(<ModeToggle showLabel={false} />);
    await waitFor(() => {
      expect(screen.queryByText("Light")).not.toBeInTheDocument();
    });
  });

  it("should cycle from light to dark theme when clicked", async () => {
    render(<ModeToggle />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
      fireEvent.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });

  it("should cycle from dark to system theme when clicked", async () => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
      themes: ["light", "dark", "system"],
      systemTheme: "light",
      resolvedTheme: "dark",
    });

    render(<ModeToggle />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith("system");
    });
  });

  it("should cycle from system to light theme when clicked", async () => {
    mockUseTheme.mockReturnValue({
      theme: "system",
      setTheme: mockSetTheme,
      themes: ["light", "dark", "system"],
      systemTheme: "light",
      resolvedTheme: "light",
    });

    render(<ModeToggle />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });
  });

  it("should display correct icon for light theme", async () => {
    render(<ModeToggle />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute(
        "title",
        "Current theme: Light. Click to cycle themes.",
      );
    });
  });

  it("should display correct icon for dark theme", async () => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
      themes: ["light", "dark", "system"],
      systemTheme: "light",
      resolvedTheme: "dark",
    });

    render(<ModeToggle />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute(
        "title",
        "Current theme: Dark. Click to cycle themes.",
      );
    });
  });

  it("should display correct icon for system theme", async () => {
    mockUseTheme.mockReturnValue({
      theme: "system",
      setTheme: mockSetTheme,
      themes: ["light", "dark", "system"],
      systemTheme: "light",
      resolvedTheme: "light",
    });

    render(<ModeToggle />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute(
        "title",
        "Current theme: System. Click to cycle themes.",
      );
    });
  });

  it("should handle undefined theme gracefully", async () => {
    mockUseTheme.mockReturnValue({
      theme: undefined,
      setTheme: mockSetTheme,
      themes: ["light", "dark", "system"],
      systemTheme: "light",
      resolvedTheme: "light",
    });

    render(<ModeToggle />);
    await waitFor(() => {
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });
});
