'use client'
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";
import { PackageIcon, Search, ShoppingCart, Heart, Menu, X, Home, Users, Handbag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const cartCount = useSelector(state => state.cart.total) || 0;

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/shop?search=${search}`);
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const menuButton = document.querySelector('[aria-label="Toggle mobile menu"]');
            if (menuOpen && menuRef.current && !menuRef.current.contains(event.target) && event.target !== menuButton) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const textBase = "text-customBlack/80 hover:text-customBlack transition";
    const navLinkClass = "text-sm font-light uppercase tracking-wide";
    const mobileLinkClass = "flex items-center gap-4 py-3 text-base font-normal text-customBlack/90 hover:text-customBlack transition";


    return (
        <nav className="bg-white border-b border-customBlack/10 sticky top-0 z-50">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
                    <div className="hidden md:flex items-center gap-4 lg:gap-8">
                        <Link href="/" className={`${navLinkClass} ${textBase}`}>Home</Link>
                        <Link href="/shop" className={`${navLinkClass} ${textBase}`}>Shop</Link>
                        <Link href="/about" className={`${navLinkClass} ${textBase}`}>About</Link>
                        <Link href="/contact" className={`${navLinkClass} ${textBase}`}>Contact</Link>
                    </div>

                    <Link href="/" className="relative text-3xl font-semibold text-customBlack">
                        <span className='text-primary'>Cartiq</span>
                        <span className='text-customBlack text-4xl leading-0'>.</span>
                        <Protect plan='plus'>
                            <p className="absolute text-[9px] font-semibold -top-0.5 -right-6 px-1.5 py-0.5 rounded-full flex items-center gap-1 text-white bg-primary/80">
                                plus
                            </p>
                        </Protect>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-64 text-sm gap-2 bg-white px-4 py-2 border border-customBlack/10 rounded-full shadow-xs">
                            <Search size={18} className="text-customBlack/70" />
                            <input
                                className="w-full bg-transparent outline-none placeholder-customBlack/60 text-customBlack"
                                type="text"
                                placeholder="Search products"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                required
                            />
                        </form>

                        <Link href="/favorites" className={`hidden sm:block xl:block ${textBase}`} aria-label="Favorites">
                            <Heart size={18} />
                        </Link>

                        <Link
                            href="/cart"
                            className={`relative hidden sm:block ${textBase}`}
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 text-[10px] text-white bg-customBlack size-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

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

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="relative sm:hidden text-customBlack/80 hover:text-customBlack"
                            aria-label="Toggle mobile menu"
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                            {cartCount > 0 && !menuOpen && (
                                <span className="absolute -top-1 -right-1 text-[10px] text-white bg-red-500 size-3.5 flex items-center justify-center rounded-full">
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                            onClick={closeMenu}
                        />

                        <motion.div
                            key="mobileMenu"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}

                            className="fixed inset-y-0 right-0 z-50 bg-white flex flex-col pt-4 pb-4 shadow-2xl sm:hidden w-72 max-w-[80vw] overflow-y-auto border-l border-customBlack/10"
                        >
                            <div ref={menuRef} className="px-6 w-full z-50 bg-white h-full">
                                <div className="flex items-center justify-between pb-4 border-b border-customBlack/10 mb-6">
                                    {user ? (
                                        <>
                                            <p className="text-lg font-semibold text-customBlack">Hello, {user.firstName || 'User'}</p>
                                            <div className="flex items-center gap-2">
                                                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 border-customBlack/50" } }} />
                                                <button
                                                    onClick={closeMenu}
                                                    className="text-customBlack p-1"
                                                    aria-label="Close mobile menu"
                                                >
                                                    <X size={24} />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="text-xl font-bold text-customBlack">Menu</h2>
                                            <button
                                                onClick={closeMenu}
                                                className="text-customBlack p-1"
                                                aria-label="Close mobile menu"
                                            >
                                                <X size={24} />
                                            </button>
                                        </>
                                    )}
                                </div>

                                <form onSubmit={handleSearch} className="flex items-center gap-2 w-full border border-customBlack/10 rounded-full px-4 py-2 mb-6">
                                    <Search size={18} className="text-customBlack/70" />
                                    <input
                                        className="w-full bg-transparent outline-none placeholder-customBlack/60 text-customBlack"
                                        type="text"
                                        placeholder="Search for products..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        required
                                    />
                                </form>

                                <div className="flex flex-col gap-1">
                                    <Link href="/" className={mobileLinkClass} onClick={closeMenu}>
                                        <Home size={20} />
                                        <span>Home</span>
                                    </Link>
                                    <Link href="/shop" className={mobileLinkClass} onClick={closeMenu}>
                                        <Handbag size={20} />
                                        <span>Shop</span>
                                    </Link>
                                    <Link href="/cart" className={mobileLinkClass} onClick={closeMenu}>
                                        <ShoppingCart size={20} />
                                        <span>Cart</span>
                                    </Link>
                                </div>

                                <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-customBlack/10">
                                    <Link href="/favorites" className={mobileLinkClass} onClick={closeMenu}>
                                        <Heart size={20} />
                                        <span>Favorites</span>
                                    </Link>
                                    <Link href="/orders" className={mobileLinkClass} onClick={closeMenu}>
                                        <PackageIcon size={20} />
                                        <span>My Orders</span>
                                    </Link>
                                    <Link href="/" className={mobileLinkClass} onClick={closeMenu}>
                                        <Users size={20} />
                                        <span>About & Contact</span>
                                    </Link>
                                </div>

                                {!user && (
                                    <button
                                        onClick={() => {
                                            openSignIn();
                                            closeMenu();
                                        }}
                                        className="mt-6 w-full px-6 py-2 border border-customBlack text-customBlack hover:bg-customBlack hover:text-white transition rounded-full text-sm font-light uppercase"
                                    >
                                        Login / Sign Up
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;