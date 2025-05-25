import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  category: string;
  createdAt: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee Blend',
    price: 24.99,
    stock: 100,
    status: 'active',
    category: 'Beverages',
    createdAt: '2024-03-15',
  },
  {
    id: '2',
    name: 'Artisan Bread',
    price: 8.99,
    stock: 50,
    status: 'active',
    category: 'Bakery',
    createdAt: '2024-03-14',
  },
  {
    id: '3',
    name: 'Organic Tea Set',
    price: 39.99,
    stock: 25,
    status: 'draft',
    category: 'Beverages',
    createdAt: '2024-03-13',
  },
];

const ProductList = () => {
  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'archived':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Add Product
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>{product.createdAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductList; 