"use client"
const getPageItems = (currentPage, totalPages) => {
    const visiblePages = 4;
    const startPage = Math.max(1, currentPage - Math.floor((visiblePages - 1) / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const items = [];

    if (startPage > 1) {
        items.push(1);
        if (startPage > 2) {
            items.push('...');
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        items.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            items.push('...');
        }
        if (items[items.length - 1] !== totalPages) {
            items.push(totalPages);
        }
    }

    if (endPage === totalPages && totalPages > visiblePages) {
        if (items.indexOf(totalPages) !== items.length - 1) {
            items.pop();
        }
    }

    return items.filter((item, index, array) => item !== '...' || array[index - 1] !== '...');
};

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    const handlePageClick = (page) => {
        if (page < 1 || page > totalPages) return
        onPageChange(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const pageItems = getPageItems(currentPage, totalPages);

    return (
        <nav
            role="navigation"
            aria-label="Pagination"
            className="flex flex-col items-center pt-8  text-white"
        >
            {/* Progress/Indicator Bar */}
            <div className="w-full h-1 flex justify-center mb-6">
                <div className="w-1/3 bg-slate-200">
                    <div
                        className="h-1 bg-primary transition-all duration-300"
                        style={{ width: `${(currentPage / totalPages) * 100}%`, maxWidth: '100%' }}
                    ></div>
                </div>
            </div>

            <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-4 mb-24">
                {/* Previous Button */}
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


                {/* Page Number Buttons and Ellipsis */}
                {pageItems.map((item, index) => {
                    if (item === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-1.5 text-sm text-gray-400"
                            >
                                ...
                            </span>
                        );
                    }

                    const page = item;
                    return (
                        <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium border focus:ring-1 focus:ring-primary focus:outline-none ${currentPage === page
                                ? 'bg-primary text-white border-primary'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                            aria-current={currentPage === page ? 'page' : undefined}
                            aria-label={`Go to page ${page}`}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next Button */}
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
            </div>
        </nav >
    )
}