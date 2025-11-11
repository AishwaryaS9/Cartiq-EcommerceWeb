"use client"

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    const handlePageClick = (page) => {
        if (page < 1 || page > totalPages) return
        onPageChange(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <nav
            role="navigation"
            aria-label="Pagination"
            className="flex justify-center items-center flex-wrap gap-2 mt-8 sm:gap-3 mb-24"
        >
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md border text-sm transition focus:ring-1 focus:ring-primary focus:outline-none ${currentPage === 1
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                aria-label="Previous page"
            >
                ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => handlePageClick(i + 1)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium border focus:ring-1 focus:ring-primary focus:outline-none ${currentPage === i + 1
                        ? 'bg-primary text-white border-primary'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                    aria-current={currentPage === i + 1 ? 'page' : undefined}
                    aria-label={`Go to page ${i + 1}`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md border text-sm transition focus:ring-1 focus:ring-primary focus:outline-none ${currentPage === totalPages
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                aria-label="Next page"
            >
                Next →
            </button>
        </nav>
    )
}
