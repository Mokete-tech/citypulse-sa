import { render, screen, fireEvent } from '@/utils/test-utils';
import { EventCard } from './EventCard';

describe('EventCard', () => {
  const mockEvent = {
    id: 1,
    title: 'Test Event',
    description: 'This is a test event description',
    merchant_name: 'Test Organizer',
    category: 'Music',
    date: '2023-12-31',
    time: '20:00',
    location: 'Cape Town',
    price: 'R150',
    image_url: '/test-event-image.jpg',
    featured: true
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders event information correctly', () => {
    render(
      <EventCard
        id={mockEvent.id}
        title={mockEvent.title}
        description={mockEvent.description}
        merchant_name={mockEvent.merchant_name}
        category={mockEvent.category}
        date={mockEvent.date}
        time={mockEvent.time}
        location={mockEvent.location}
        price={mockEvent.price}
        image_url={mockEvent.image_url}
        featured={mockEvent.featured}
        onClick={mockOnClick}
      />
    );

    // Check if the event title is rendered
    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
    
    // Check if the organizer name is rendered
    expect(screen.getByText(mockEvent.merchant_name)).toBeInTheDocument();
    
    // Check if the location is rendered
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
    
    // Check if the date is rendered
    expect(screen.getByText(mockEvent.date)).toBeInTheDocument();
    
    // Check if the time is rendered
    expect(screen.getByText(mockEvent.time)).toBeInTheDocument();
    
    // Check if the price is rendered
    expect(screen.getByText(mockEvent.price)).toBeInTheDocument();
    
    // Check if the featured badge is rendered
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', () => {
    render(
      <EventCard
        id={mockEvent.id}
        title={mockEvent.title}
        description={mockEvent.description}
        merchant_name={mockEvent.merchant_name}
        category={mockEvent.category}
        date={mockEvent.date}
        time={mockEvent.time}
        location={mockEvent.location}
        price={mockEvent.price}
        image_url={mockEvent.image_url}
        featured={mockEvent.featured}
        onClick={mockOnClick}
      />
    );

    // Find the card and click it
    const card = screen.getByRole('article');
    fireEvent.click(card);
    
    // Check if onClick was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders with fallback image when image_url is not provided', () => {
    render(
      <EventCard
        id={mockEvent.id}
        title={mockEvent.title}
        description={mockEvent.description}
        merchant_name={mockEvent.merchant_name}
        category={mockEvent.category}
        date={mockEvent.date}
        time={mockEvent.time}
        location={mockEvent.location}
        price={mockEvent.price}
        featured={mockEvent.featured}
        onClick={mockOnClick}
      />
    );

    // The component should not crash without an image URL
    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
  });

  it('does not show featured badge when featured is false', () => {
    render(
      <EventCard
        id={mockEvent.id}
        title={mockEvent.title}
        description={mockEvent.description}
        merchant_name={mockEvent.merchant_name}
        category={mockEvent.category}
        date={mockEvent.date}
        time={mockEvent.time}
        location={mockEvent.location}
        price={mockEvent.price}
        image_url={mockEvent.image_url}
        featured={false}
        onClick={mockOnClick}
      />
    );

    // Featured badge should not be present
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('handles missing optional props gracefully', () => {
    render(
      <EventCard
        id={mockEvent.id}
        title={mockEvent.title}
        description={mockEvent.description}
        date={mockEvent.date}
        location={mockEvent.location}
        featured={false}
        onClick={mockOnClick}
      />
    );

    // The component should render without optional props
    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
    
    // Optional props should not be present
    expect(screen.queryByText(mockEvent.merchant_name)).not.toBeInTheDocument();
    expect(screen.queryByText(mockEvent.price)).not.toBeInTheDocument();
  });
});
