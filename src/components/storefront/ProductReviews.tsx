"use client";

import { useState } from "react";
import { Star, ThumbsUp, ImageIcon, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import BlurFade from "@/components/ui/blur-fade";

interface ProductReviewsProps {
  productId: string;
}

// Future Supabase Type
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { isAuthenticated } = useAuthStore();
  const [isWritingReview, setIsWritingReview] = useState(false);

  // Currently, we strictly enforce a 0-review state as requested
  const reviews: Review[] = [];
  const averageRating = 0;
  const totalReviews = 0;
  const ratingDistribution = [
    { stars: 5, count: 0, percentage: 0 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  return (
    <section className="py-20 bg-white border-t border-brand-gray/10">
      <div className="container mx-auto px-4">
        <BlurFade delay={0.1}>
          <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
            
            {/* Left Column: Summary & Breakdown */}
            <div className="w-full md:w-1/3 shrink-0">
              <h2 className="font-heading text-3xl font-bold text-brand-blue mb-8">Customer Reviews</h2>
              
              <div className="bg-brand-light rounded-3xl p-8 border border-brand-gray/10 mb-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="text-center">
                    <span className="font-heading text-6xl font-bold text-brand-blue leading-none">{averageRating.toFixed(1)}</span>
                    <p className="text-sm text-brand-gray mt-2">{totalReviews} Reviews</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex text-brand-gray/30">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-6 h-6 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {ratingDistribution.map((dist) => (
                    <div key={dist.stars} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-brand-blue w-12 flex items-center gap-1">
                        {dist.stars} <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
                      </span>
                      <div className="flex-1 h-2.5 bg-brand-gray/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#D4AF37] rounded-full" 
                          style={{ width: `${dist.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-brand-gray w-8 text-right">{dist.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-brand-blue mb-3">Review this product</h3>
                <p className="text-sm text-brand-gray mb-6 leading-relaxed">
                  Share your thoughts with other customers. Your feedback helps us improve and helps others make better choices.
                </p>
                {isAuthenticated ? (
                  <button 
                    onClick={() => setIsWritingReview(true)}
                    className="w-full bg-white border-2 border-brand-blue text-brand-blue font-bold py-3.5 px-6 rounded-xl hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" /> Write a Review
                  </button>
                ) : (
                  <Link 
                    href="/login"
                    className="w-full bg-white border-2 border-brand-blue text-brand-blue font-bold py-3.5 px-6 rounded-xl hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center gap-2 text-center"
                  >
                    Sign in to Review
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Review List */}
            <div className="w-full md:w-2/3">
              {reviews.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-brand-light/50 rounded-3xl border border-brand-gray/10 border-dashed">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-brand-gray/5">
                    <MessageSquare className="w-8 h-8 text-brand-gray/40" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-brand-blue mb-2">No Reviews Yet</h3>
                  <p className="text-brand-gray max-w-md mx-auto mb-8">
                    Be the first to review this product! We value your authentic feedback and experiences.
                  </p>
                  {isAuthenticated && (
                    <button 
                      onClick={() => setIsWritingReview(true)}
                      className="bg-brand-green text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#148356] transition-colors"
                    >
                      Write the First Review
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Future reviews will be mapped here */}
                </div>
              )}

              {/* Future Review Form Modal/Drawer will be implemented here */}
            </div>

          </div>
        </BlurFade>
      </div>
    </section>
  );
}
