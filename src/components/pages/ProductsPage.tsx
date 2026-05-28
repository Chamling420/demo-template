'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingBag, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['All', 'Hair', 'Skin', 'Lips'] as const;

const categoryColorMap: Record<string, string> = {
  Hair: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  Skin: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Lips: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
};

export default function ProductsPage() {
  const { currentUser, products, setCurrentPage, addToCart } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<string>('default');

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'All' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'low-to-high') return a.price - b.price;
      if (sortOrder === 'high-to-low') return b.price - a.price;
      return 0;
    });

  const handleAddToCart = (productId: string) => {
    if (!currentUser) {
      toast.error('Please log in to add items to your cart');
      setCurrentPage('login');
      return;
    }
    addToCart(productId);
    toast.success('Added to cart!');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ============ PAGE HEADER ============ */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 dark:from-rose-950/40 dark:via-pink-950/30 dark:to-rose-900/20" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-200/20 dark:bg-pink-800/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <ShoppingBag className="w-4 h-4" />
            Shop Collection
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Beauty{' '}
            <span className="bg-gradient-to-r from-primary via-rose-500 to-primary bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Discover premium beauty essentials handpicked for your self-care routine
          </p>
        </div>
      </section>

      {/* ============ TOOLBAR ============ */}
      <section className="px-4 sm:px-6 py-6 bg-background border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full rounded-lg"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[160px] rounded-lg">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort by Price */}
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-lg">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="low-to-high">Price: Low to High</SelectItem>
                <SelectItem value="high-to-low">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT GRID ============ */}
      <section className="flex-1 px-4 sm:px-6 py-8 sm:py-10 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No products found
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border-0 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-square bg-secondary/50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Category badge overlaid on image */}
                    <div className="absolute top-3 left-3">
                      <Badge
                        className={`${categoryColorMap[product.category] || 'bg-secondary text-secondary-foreground'} text-xs font-medium px-2.5 py-1 border-0`}
                      >
                        {product.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-4 pb-2">
                    <span className="text-2xl font-bold text-primary">
                      NPR {product.price.toFixed(2)}
                    </span>
                  </CardContent>

                  <CardFooter className="px-4 pb-4 pt-0">
                    <Button
                      className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 group/btn"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
