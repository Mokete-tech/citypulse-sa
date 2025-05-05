import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const categories = [
  {
    name: 'Food & Drink',
    subcategories: ['Restaurants', 'Cafes', 'Bars', 'Fast Food', 'Bakeries']
  },
  {
    name: 'Shopping',
    subcategories: ['Clothing', 'Electronics', 'Groceries', 'Home Goods', 'Books']
  },
  {
    name: 'Services',
    subcategories: ['Beauty', 'Health', 'Automotive', 'Financial', 'Professional']
  }
];

const FilterCategories = () => {
  const [distance, setDistance] = useState(10);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleDistanceChange = (value: number[]) => {
    setDistance(value[0]);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const resetFilters = () => {
    setDistance(10);
    setPriceRange([0, 100]);
    setSelectedCategories([]);
  };

  return (
    <div className="p-4 space-y-6 text-white">
      <h3 className="text-lg font-semibold mb-2">Categories</h3>
      
      <Accordion type="multiple" className="w-full">
        {categories.map((category) => (
          <AccordionItem key={category.name} value={category.name} className="border-b border-sky-700">
            <AccordionTrigger className="py-2 text-sm font-medium hover:text-white">
              {category.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-2 space-y-2">
                {category.subcategories.map((sub) => (
                  <div key={sub} className="flex items-center space-x-2">
                    <Checkbox 
                      id={sub} 
                      checked={selectedCategories.includes(sub)}
                      onCheckedChange={() => handleCategoryChange(sub)}
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-sa-blue"
                    />
                    <Label htmlFor={sub} className="text-sm cursor-pointer text-white">{sub}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Distance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Within {distance} km</span>
            </div>
            <Slider
              value={[distance]}
              min={1}
              max={50}
              step={1}
              onValueChange={handleDistanceChange}
              className="[&_[role=slider]]:bg-white"
            />
            <div className="flex justify-between text-xs text-gray-300">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Price Range</h3>
          <Slider
            value={priceRange}
            min={0}
            max={100}
            step={1}
            onValueChange={handlePriceChange}
            className="[&_[role=slider]]:bg-white"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>R{priceRange[0]}</span>
            <span>R{priceRange[1]}</span>
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
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterCategories;
