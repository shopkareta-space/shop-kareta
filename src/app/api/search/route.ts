import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/services/product.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limitParam = searchParams.get('limit');
    
    if (!query) {
      return NextResponse.json({ products: [] });
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const products = await searchProducts(query, limit);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
