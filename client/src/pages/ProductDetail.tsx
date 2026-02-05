import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ShoppingBag, Heart } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: product, isLoading } = useProduct(id);
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <div className="pt-24 text-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Navbar overlay */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
        <button 
          onClick={() => setLocation("/feed")}
          className="p-3 bg-background/80 backdrop-blur-md rounded-full shadow-sm hover:bg-background transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <button className="p-3 bg-background/80 backdrop-blur-md rounded-full shadow-sm hover:bg-background transition-colors text-primary">
          <Heart size={24} />
        </button>
      </div>

      <div className="md:grid md:grid-cols-2 max-w-7xl mx-auto h-full min-h-screen">
        {/* Image Side */}
        <div className="relative h-[50vh] md:h-screen w-full bg-muted">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Side */}
        <div className="p-6 md:p-12 md:flex md:flex-col md:justify-center relative bg-background rounded-t-[2rem] md:rounded-none -mt-8 md:mt-0 z-10 shadow-xl md:shadow-none">
          <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.2 }}
          >
            <div className="mb-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight">
              {product.title}
            </h1>
            
            <div className="text-3xl font-bold text-primary mb-8">
              ${(product.price / 100).toFixed(2)}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="flex gap-4">
              <Button className="flex-1 h-14 rounded-full text-lg font-bold shadow-xl shadow-primary/25">
                Buy Now
              </Button>
              <Button variant="secondary" className="h-14 w-14 rounded-full p-0">
                <ShoppingBag size={24} />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
