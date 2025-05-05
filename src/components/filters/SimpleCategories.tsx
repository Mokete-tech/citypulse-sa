import React from 'react';
import { Button } from '@/components/ui/button';

const SimpleCategories = () => {
  return (
    <div className="p-4 space-y-6 text-white">
      <h3 className="text-lg font-semibold mb-2">Categories</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="food-drink" className="rounded border-white" />
          <label htmlFor="food-drink" className="text-sm cursor-pointer text-white">Food & Drink</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="shopping" className="rounded border-white" />
          <label htmlFor="shopping" className="text-sm cursor-pointer text-white">Shopping</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="services" className="rounded border-white" />
          <label htmlFor="services" className="text-sm cursor-pointer text-white">Services</label>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-sky-700">
        <div>
          <h3 className="text-lg font-semibold mb-2">Distance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Within 10 km</span>
            </div>
            <div className="flex justify-between text-xs text-gray-300">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Price Range</h3>
          <div className="flex justify-between mt-2 text-sm">
            <span>R0</span>
            <span>R100</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Sort By</h3>
          <select className="w-full p-2 border rounded-md text-sm bg-sky-700 border-sky-600 text-white">
            <option value="relevance">Relevance</option>
            <option value="distance">Distance</option>
            <option value="rating">Rating</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-4 border-white text-white hover:bg-sky-700"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default SimpleCategories;
