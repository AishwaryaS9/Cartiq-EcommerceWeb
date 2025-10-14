'use client'
import { PackageIcon, Search, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";

const Navbar = () => {

    const { user } = useUser();
    const { openSignIn } = useClerk();
    const router = useRouter();

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    const textBase = "text-customBlack/80 hover:text-customBlack transition";
    const iconSize = 18;
    const navLinkClass = "text-sm font-light uppercase tracking-wide";

    return (
        <nav className="bg-white border-b border-customBlack/10 sticky top-0 z-50">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <div className="flex items-center gap-4 lg:gap-8">
                        <Link href="/" className={`${navLinkClass} ${textBase} hidden md:block`}>Home</Link>
                        <Link href="/shop" className={`${navLinkClass} ${textBase}`}>Shop</Link>
                        <Link href="/" className={`${navLinkClass} ${textBase} hidden lg:block`}>About</Link>
                        <Link href="/" className={`${navLinkClass} ${textBase} hidden lg:block`}>Contact</Link>
                    </div>

                    <Link href="/" className="relative text-3xl font-semibold text-customBlack">
                        <span className='text-primary'>Cartiq</span><span className='text-customBlack text-4xl leading-0'>.</span>
                        <Protect plan='plus'>
                            <p className="absolute text-[9px] font-semibold -top-0.5 -right-6 px-1.5 py-0.5 rounded-full flex items-center gap-1 text-white bg-primary/80">
                                plus
                            </p>
                        </Protect>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-6">

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-64 text-sm gap-2 bg-white px-4 py-2 border border-customBlack/10 rounded-full shadow-xs">
                            <Search size={iconSize} className="text-customBlack/70" />
                            <input
                                className="w-full bg-transparent outline-none placeholder-customBlack/60 text-customBlack"
                                type="text"
                                placeholder="Search products"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                required
                            />
                        </form>

                        <button className={`hidden xl:block ${textBase}`} aria-label="Favorites">
                            <Heart size={iconSize} />
                        </button>

                        <div className="hidden sm:flex items-center gap-4">

                            {!user ? (
                                <button onClick={openSignIn} className="px-5 py-2 border border-customBlack text-customBlack hover:bg-customBlack hover:text-white transition rounded-full text-sm font-light uppercase">
                                    Login
                                </button>
                            ) : (
                                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-6 h-6 border-customBlack/50" } }}>
                                    <UserButton.MenuItems>
                                        <UserButton.Action label="My Orders" onClick={() => router.push('/orders')} labelIcon={<PackageIcon size={16} />} />
                                    </UserButton.MenuItems>
                                </UserButton>
                            )}
                        </div>

                        <Link href="/cart" className={`relative ${textBase}`} aria-label="Shopping Cart">
                            <ShoppingCart size={iconSize} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 text-[10px] text-white bg-customBlack size-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="sm:hidden">
                            {user ? (
                                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-6 h-6 border-customBlack/50" } }}>
                                    <UserButton.MenuItems>
                                        <UserButton.Action label="Cart" onClick={() => router.push('/cart')} labelIcon={<ShoppingCart size={16} />} />
                                        <UserButton.Action label="My Orders" onClick={() => router.push('/orders')} labelIcon={<PackageIcon size={16} />} />
                                    </UserButton.MenuItems>
                                </UserButton>
                            ) : (
                                <button onClick={openSignIn} className="px-4 py-1.5 border border-customBlack text-customBlack hover:bg-customBlack hover:text-white transition text-xs rounded-full">
                                    Login
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar