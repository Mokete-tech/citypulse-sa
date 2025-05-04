import { render, screen, fireEvent } from '@/utils/test-utils';
import { DealCard } from './DealCard';

describe('DealCard', () => {
  const mockDeal = {
    id: 1,
    title: 'Test Deal',
    description: 'This is a test deal description',
    merchant_name: 'Test Merchant',
    category: 'Food & Drink',
    expiration_date: '2023-12-31',
    discount: '20% off',
    image_url: '/test-image.jpg',
    featured: true
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders deal information correctly', () => {
    render(
      <DealCard
        id={mockDeal.id}
        title={mockDeal.title}
        description={mockDeal.description}
        merchant_name={mockDeal.merchant_name}
        category={mockDeal.category}
        expiration_date={mockDeal.expiration_date}
        discount={mockDeal.discount}
        image_url={mockDeal.image_url}
        featured={mockDeal.featured}
        onClick={mockOnClick}
      />
    );

    // Check if the deal title is rendered
    expect(screen.getByText(mockDeal.title)).toBeInTheDocument();
    
    // Check if the merchant name is rendered
    expect(screen.getByText(mockDeal.merchant_name)).toBeInTheDocument();
    
    // Check if the category is rendered
    expect(screen.getByText(mockDeal.category)).toBeInTheDocument();
    
    // Check if the discount is rendered
    expect(screen.getByText(mockDeal.discount)).toBeInTheDocument();
    
    // Check if the featured badge is rendered
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', () => {
    render(
      <DealCard
        id={mockDeal.id}
        title={mockDeal.title}
        description={mockDeal.description}
        merchant_name={mockDeal.merchant_name}
        category={mockDeal.category}
        expiration_date={mockDeal.expiration_date}
        discount={mockDeal.discount}
        image_url={mockDeal.image_url}
        featured={mockDeal.featured}
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
      <DealCard
        id={mockDeal.id}
        title={mockDeal.title}
        description={mockDeal.description}
        merchant_name={mockDeal.merchant_name}
        category={mockDeal.category}
        expiration_date={mockDeal.expiration_date}
        discount={mockDeal.discount}
        featured={mockDeal.featured}
        onClick={mockOnClick}
      />
    );

    // The component should not crash without an image URL
    expect(screen.getByText(mockDeal.title)).toBeInTheDocument();
  });

  it('does not show featured badge when featured is false', () => {
    render(
      <DealCard
        id={mockDeal.id}
        title={mockDeal.title}
        description={mockDeal.description}
        merchant_name={mockDeal.merchant_name}
        category={mockDeal.category}
        expiration_date={mockDeal.expiration_date}
        discount={mockDeal.discount}
        image_url={mockDeal.image_url}
        featured={false}
        onClick={mockOnClick}
      />
    );

    // Featured badge should not be present
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });
});
