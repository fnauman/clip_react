import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ModelInterface from './ModelInterface';
import '@testing-library/jest-dom';

describe('ModelInterface Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders file upload interface', () => {
    render(<ModelInterface />);
    expect(screen.getByText(/Upload an Image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Choose file/i)).toBeInTheDocument();
  });

  test('handles file upload', () => {
    render(<ModelInterface />);
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Choose file/i);

    fireEvent.change(input, { target: { files: [file] } });
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
  });

  test('displays error when API call fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));
    render(<ModelInterface />);
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Choose file/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    const submitButton = screen.getByText(/Analyze/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  test('displays results when API call succeeds', async () => {
    const mockResponse = {
      probabilities: [0.9, 0.8],
      labels: ['green', 'blue']
    };
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    render(<ModelInterface />);
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Choose file/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    const submitButton = screen.getByText(/Analyze/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/90%/)).toBeInTheDocument();
      expect(screen.getByText(/green/)).toBeInTheDocument();
    });
  });
});
