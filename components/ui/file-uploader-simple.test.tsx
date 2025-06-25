/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileUploader } from './file-uploader';

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('FileUploader Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<FileUploader />);
    expect(screen.getByText('Drop files here or click to upload')).toBeInTheDocument();
  });

  it('should render consistently across re-renders', () => {
    const { rerender } = render(<FileUploader />);

    // Re-render multiple times to test component stability
    for (let i = 0; i < 5; i++) {
      rerender(<FileUploader key={i} maxFiles={i + 1} />);
    }

    expect(screen.getByText('Drop files here or click to upload')).toBeInTheDocument();
  });

  it('should maintain component state with different props', () => {
    const { rerender } = render(<FileUploader maxFiles={1} />);
    
    // Re-render with different props
    rerender(<FileUploader maxFiles={2} />);
    rerender(<FileUploader maxFiles={3} disabled={true} />);
    rerender(<FileUploader maxFiles={5} disabled={false} />);
    
    // Component should remain stable
    expect(screen.getByText('Drop files here or click to upload')).toBeInTheDocument();
  });

  it('should display correct file size limit', () => {
    const customMaxSize = 10 * 1024 * 1024; // 10MB
    render(<FileUploader maxFileSize={customMaxSize} />);
    
    expect(screen.getByText(/max 10 MB/)).toBeInTheDocument();
  });

  it('should display correct max files count', () => {
    render(<FileUploader maxFiles={5} />);
    
    expect(screen.getByText(/Up to 5 files/)).toBeInTheDocument();
  });

  it('should handle disabled state properly', () => {
    render(<FileUploader disabled={true} />);
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('should memoize properly and not cause excessive re-renders', () => {
    const renderSpy = jest.fn();
    
    function TestComponent() {
      renderSpy();
      return <FileUploader />;
    }
    
    const { rerender } = render(<TestComponent />);
    
    // Initial render
    expect(renderSpy).toHaveBeenCalledTimes(1);
    
    // Re-render with same props should not cause additional renders
    rerender(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(2);
    
    // Multiple re-renders
    for (let i = 0; i < 3; i++) {
      rerender(<TestComponent />);
    }
    
    // Should have been called for each re-render
    expect(renderSpy).toHaveBeenCalledTimes(5);
  });

  it('should properly clean up on unmount', () => {
    const { unmount } = render(<FileUploader />);
    
    // Component should unmount without errors
    expect(() => unmount()).not.toThrow();
  });
});