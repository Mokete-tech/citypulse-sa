
import { useEffect, useState } from 'react';
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

interface Deal {
  id: number;
  title: string;
  location: string;
  date: string;
  price: number;
}

export function DealsCrud() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.from('deals').select('id, title, location, date, price').order('date');
      
      if (error) {
        throw error;
      }
      
      setDeals(data || []);
    } catch (err: any) {
      console.error('Error fetching deals:', err);
      setError(err.message || 'Failed to load deals');
      toast.error('Could not load deals', { description: 'Please try again later' });
      // Use fallback data if needed
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchDeals(); 
  }, []);

  const addDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const newDeal = {
        title, 
        location, 
        date, 
        price: Number(price) || 0
      };
      
      const { error } = await supabase.from('deals').insert(newDeal);
      
      if (error) {
        throw error;
      }

      toast.success('Deal added successfully!');
      
      // Reset form
      setTitle(''); 
      setLocation(''); 
      setDate(''); 
      setPrice(0);
      
      // Refresh deals list
      fetchDeals();
    } catch (err: any) {
      console.error('Error adding deal:', err);
      toast.error('Failed to add deal', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Deals</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={addDeal} className="flex flex-wrap gap-2 mb-4">
        <input 
          placeholder="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          className="px-3 py-2 border rounded"
          required 
        />
        <input 
          placeholder="Location" 
          value={location} 
          onChange={e => setLocation(e.target.value)}
          className="px-3 py-2 border rounded"
          required 
        />
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)}
          className="px-3 py-2 border rounded"
          required 
        />
        <input 
          type="number" 
          value={price} 
          onChange={e => setPrice(Number(e.target.value))}
          className="px-3 py-2 border rounded"
          required 
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
      
      {loading && <p>Loading deals...</p>}
      
      <ul className="space-y-2">
        {deals.map(deal => (
          <li key={deal.id} className="p-3 border rounded hover:bg-gray-50">
            <strong>{deal.title}</strong> @ {deal.location} on {deal.date} - R{deal.price}
          </li>
        ))}
        {deals.length === 0 && !loading && (
          <p className="text-gray-500 text-sm italic">No deals available</p>
        )}
      </ul>
    </div>
  );
}
