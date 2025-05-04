import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import GlobalSearch from './GlobalSearch';
import { supabase } from '@/integrations/supabase/client';

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    rpc: jest.fn().mockReturnThis(),
  }
}));

describe('GlobalSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search button correctly', () => {
    render(<GlobalSearch />);
    
    // Check if the search button is rendered
    expect(screen.getByText('Search...')).toBeInTheDocument();
  });

  it('opens the search dialog when the button is clicked', () => {
    render(<GlobalSearch />);
    
    // Click the search button
    fireEvent.click(screen.getByText('Search...'));
    
    // Check if the search dialog is opened
    expect(screen.getByPlaceholderText('Search deals, events, merchants...')).toBeInTheDocument();
  });

  it('performs a search when query is entered', async () => {
    // Mock the Supabase response
    const mockDealsResponse = {
      data: [
        { id: 1, title: 'Test Deal', category: 'Food', merchant_name: 'Test Merchant' }
      ],
      error: null
    };
    
    const mockEventsResponse = {
      data: [
        { id: 1, title: 'Test Event', category: 'Music', location: 'Cape Town', date: '2023-12-31' }
      ],
      error: null
    };
    
    const mockMerchantsResponse = {
      data: [],
      error: null
    };
    
    // Set up the mock implementation for each query
    (supabase.from as jest.Mock).mockImplementation((table) => {
      if (table === 'deals') {
        return {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue(mockDealsResponse)
        };
      } else if (table === 'events') {
        return {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue(mockEventsResponse)
        };
      } else if (table === 'merchants') {
        return {
          select: jest.fn().mockReturnThis(),
          or: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue(mockMerchantsResponse)
        };
      } else if (table === 'analytics') {
        return {
          insert: jest.fn().mockResolvedValue({ error: null })
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null })
      };
    });
    
    render(<GlobalSearch />);
    
    // Open the search dialog
    fireEvent.click(screen.getByText('Search...'));
    
    // Enter a search query
    const searchInput = screen.getByPlaceholderText('Search deals, events, merchants...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Wait for the search results to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Deal')).toBeInTheDocument();
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Check if the correct groups are displayed
    expect(screen.getByText('Deals')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  it('shows "No results found" when search returns empty results', async () => {
    // Mock empty responses for all tables
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ error: null })
    }));
    
    render(<GlobalSearch />);
    
    // Open the search dialog
    fireEvent.click(screen.getByText('Search...'));
    
    // Enter a search query
    const searchInput = screen.getByPlaceholderText('Search deals, events, merchants...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    // Wait for the "No results found" message
    await waitFor(() => {
      expect(screen.getByText('No results found.')).toBeInTheDocument();
    });
  });

  it('clears the search input when the clear button is clicked', async () => {
    render(<GlobalSearch />);
    
    // Open the search dialog
    fireEvent.click(screen.getByText('Search...'));
    
    // Enter a search query
    const searchInput = screen.getByPlaceholderText('Search deals, events, merchants...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Click the clear button
    const clearButton = screen.getByRole('button', { name: '' }); // The X button has no accessible name
    fireEvent.click(clearButton);
    
    // Check if the input is cleared
    expect(searchInput).toHaveValue('');
  });
});
