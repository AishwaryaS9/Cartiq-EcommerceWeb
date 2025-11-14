'use client'
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { PackageIcon, Search, ShoppingCart, Heart, Menu, X, Home, Users, Handbag } from "lucide-react";

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

    const textBase = "text-customBlack/80 hover:text-customBlack focus:text-customBlack focus:outline-none transition";
    const navLinkClass = "text-sm font-light uppercase tracking-wide focus:underline underline-offset-4";
    const mobileLinkClass = "flex items-center gap-4 py-3 text-base font-normal text-customBlack/90 hover:text-customBlack focus:text-customBlack focus:bg-gray-100 rounded-md transition";

    return (
        <header role="banner" aria-label="Main site navigation" className="bg-white border-b border-customBlack/10 sticky top-0 z-50 shadow-xs">
            <nav role="navigation" aria-label="Primary" className="mx-6 ">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-8">
                        <Link href="/" className={`${navLinkClass} ${textBase}`} aria-label="Go to homepage">Home</Link>
                        <Link href="/shop" className={`${navLinkClass} ${textBase}`} aria-label="Shop products">Shop</Link>
                        <Link href="/about" className={`${navLinkClass} ${textBase}`} aria-label="Learn more about us">About</Link>
                        <Link href="/contact" className={`${navLinkClass} ${textBase}`} aria-label="Contact support">Contact</Link>
                    </div>

                    {/* Logo */}
                    <Link href="/" className="relative text-3xl font-semibold text-customBlack focus:outline-none" aria-label="Cartiq homepage">
                        <span className='text-primary'>Cartiq</span>
                        <span className='text-customBlack text-4xl leading-0'>.</span>
                        <Protect plan='plus'>
                            <span className="absolute text-[9px] font-semibold -top-0.5 -right-6 px-1.5 py-0.5 rounded-full text-white bg-primary/80">
                                plus
                            </span>
                        </Protect>
                    </Link>

                    {/* Actions Section */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden xl:flex items-center w-64 text-sm gap-2 bg-white px-4 py-2 border border-customBlack/10 rounded-full shadow-xs"
                            role="search"
                            aria-label="Product search form"
                        >
                            <Search size={18} className="text-customBlack/70" aria-hidden="true" />
                            <input
                                className="w-full bg-transparent outline-none placeholder-customBlack/60 text-customBlack"
                                type="search"
                                placeholder="Search products"
                                aria-label="Search products"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                required
                            />
                        </form>

                        {/* Favorite Icon */}
                        <Link href="/favorites" className={`hidden sm:block xl:block ${textBase}`} aria-label="View favorites">
                            <Heart size={18} aria-hidden="true" />
                        </Link>

                        {/* Shopping Cart */}
                        <Link href="/cart" className={`relative hidden sm:block ${textBase}`} aria-label={`Shopping cart with ${cartCount} items`}>
                            <ShoppingCart size={18} aria-hidden="true" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 text-[10px] text-white bg-primary size-4 flex items-center justify-center rounded-full" role="status" aria-label={`${cartCount} items in cart`}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth Section */}
                        <div className="hidden sm:flex items-center gap-4">
                            {!user ? (
                                <button
                                    onClick={openSignIn}
                                    className="px-5 py-2 border border-customBlack text-customBlack hover:bg-primary hover:border-none hover:text-white transition rounded-full text-sm font-light uppercase focus:outline-none focus:ring-0 focus:ring-primary"
                                    aria-label="Login or create account"
                                >
                                    Login
                                </button>
                            ) : (
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{ elements: { userButtonAvatarBox: "w-6 h-6 border-customBlack/50" } }}
                                    aria-label="User account menu"
                                >
                                    <UserButton.MenuItems>
                                        <UserButton.Action label="My Orders" onClick={() => router.push('/orders')} labelIcon={<PackageIcon size={16} />} />
                                    </UserButton.MenuItems>
                                </UserButton>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="relative sm:hidden text-customBlack/80 hover:text-customBlack focus:outline-none"
                            aria-label="Toggle mobile menu"
                            aria-expanded={menuOpen}
                            aria-controls="mobile-navigation"
                        >
                            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
                            {cartCount > 0 && !menuOpen && (
                                <span className="absolute -top-1 -right-1 text-[10px] text-white bg-red-500 size-3.5 flex items-center justify-center rounded-full" role="status" aria-label={`${cartCount} items in cart`} />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- Mobile Menu --- */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                            onClick={closeMenu}
                            aria-hidden="true"
                        />

                        <motion.aside
                            key="mobileMenu"
                            id="mobile-navigation"
                            ref={menuRef}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mobile navigation menu"
                            className="fixed inset-y-0 right-0 z-50 bg-white flex flex-col pt-4 pb-4 shadow-2xl sm:hidden w-72 max-w-[80vw] overflow-y-auto border-l border-customBlack/10"
                        >
                            <div className="px-6 w-full z-50 bg-white h-full">
                                {/* Header Section */}
                                <div className="flex items-center justify-between pb-4 border-b border-customBlack/10 mb-6">
                                    {user ? (
                                        <>
                                            <p className="text-lg font-semibold text-customBlack" id="menu-heading">
                                                Hello, {user.firstName || 'User'}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 border-customBlack/50" } }} />
                                                <button onClick={closeMenu} className="text-customBlack p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Close mobile menu">
                                                    <X size={24} aria-hidden="true" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h2 id="menu-heading" className="text-xl font-bold text-customBlack">Menu</h2>
                                            <button onClick={closeMenu} className="text-customBlack p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Close mobile menu">
                                                <X size={24} aria-hidden="true" />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Search */}
                                <form onSubmit={handleSearch} className="flex items-center gap-2 w-full border border-customBlack/10 rounded-full px-4 py-2 mb-6" role="search">
                                    <Search size={18} className="text-customBlack/70" aria-hidden="true" />
                                    <input
                                        className="w-full bg-transparent outline-none placeholder-customBlack/60 text-customBlack"
                                        type="search"
                                        placeholder="Search for products..."
                                        aria-label="Search for products"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        required
                                    />
                                </form>

                                {/* Navigation Links */}
                                <nav aria-labelledby="menu-heading" className="flex flex-col gap-1">
                                    <Link href="/" className={mobileLinkClass} onClick={closeMenu}><Home size={20} aria-hidden="true" /> <span>Home</span></Link>
                                    <Link href="/shop" className={mobileLinkClass} onClick={closeMenu}><Handbag size={20} aria-hidden="true" /> <span>Shop</span></Link>
                                    <Link href="/cart" className={mobileLinkClass} onClick={closeMenu}><ShoppingCart size={20} aria-hidden="true" /> <span>Cart</span></Link>

                                    <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-customBlack/10">
                                        <Link href="/favorites" className={mobileLinkClass} onClick={closeMenu}><Heart size={20} aria-hidden="true" /> <span>Favorites</span></Link>
                                        <Link href="/orders" className={mobileLinkClass} onClick={closeMenu}><PackageIcon size={20} aria-hidden="true" /> <span>My Orders</span></Link>
                                        <Link href="/about" className={mobileLinkClass} onClick={closeMenu}><Users size={20} aria-hidden="true" /> <span>About & Contact</span></Link>
                                    </div>
                                </nav>

                                {!user && (
                                    <button
                                        onClick={() => {
                                            openSignIn();
                                            closeMenu();
                                        }}
                                        className="mt-6 w-full px-6 py-2 border border-customBlack text-customBlack hover:bg-primary hover:border-none hover:text-white transition rounded-full text-sm font-light uppercase focus:outline-none focus:ring-2 focus:ring-primary"
                                        aria-label="Login to your account"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
