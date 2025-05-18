import { useEffect, useState } from 'react';
import { supabase } from "../integrations/supabase/client";

export function DealsCrud() {
  const [deals, setDeals] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState<number>(0);

  const fetchDeals = async () => {
    const { data, error } = await supabase.from('deals').select('*').order('date');
    if (error) {
      alert(error.message);
    }
    setDeals(data || []);
  };

  useEffect(() => { fetchDeals(); }, []);

  const addDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('deals').insert({ title, location, date, price });
    if (error) {
      alert(error.message);
    }
    setTitle(''); setLocation(''); setDate(''); setPrice(0);
    fetchDeals();
  };

  return (
    <div>
      <h2>Deals</h2>
      <form onSubmit={addDeal} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} required />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} required />
        <input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {deals.map(deal => (
          <li key={deal.id}>{deal.title} @ {deal.location} on {deal.date} - R{deal.price}</li>
        ))}
      </ul>
    </div>
  );
}
