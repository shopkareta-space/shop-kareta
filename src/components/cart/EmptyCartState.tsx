import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { premiumSpring, fadeUp } from "@/lib/motion";

export function EmptyCartState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={premiumSpring}
        className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mb-6 text-brand-green border border-brand-green/10 shadow-sm"
      >
        <ShoppingBag className="w-10 h-10" />
      </motion.div>
      
      <motion.h2 
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="font-heading text-2xl font-bold text-brand-blue mb-3"
      >
        Your cart is empty
      </motion.h2>
      
      <motion.p 
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
        className="text-brand-gray mb-8 max-w-sm"
      >
        Discover our premium range of natural wellness products and start your holistic journey today.
      </motion.p>
      
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
      >
        <Link href="/shop">
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={premiumSpring}
            className="h-14 px-8 bg-brand-blue text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#0c593a] hover:shadow-lg hover:shadow-brand-green/20 transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
