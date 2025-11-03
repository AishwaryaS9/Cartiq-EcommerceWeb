'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import ProductCard from '@/components/ProductCard';
import Loading from '@/components/Loading';

export default function ProductsByCategories() {
    const params = useParams();
    const category = decodeURIComponent(params.categoryName);

    const [loading, setLoading] = useState(true);
    const [productsList, setProductsList] = useState([]);
    const products = useSelector(state => state.product.list);

    const fetchProduct = async () => {
        try {
            const product = products.filter((item) => item.category === category);
            setProductsList(() => {
                return product;
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products by category:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (category) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [category, products]);

    if (productsList.length === 0 && !loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">No products found in {category} category</h1>
            </div>
        )
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="min-h-[70vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1 onClick={() => router.push('/shop')} className="text-2xl font-medium text-primary my-6 flex items-center gap-2 cursor-pointer">{category}</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-32">
                    {productsList.map((item) => <ProductCard key={item.id} product={item} />)}
                </div>
            </div>
        </div>
    )
}
