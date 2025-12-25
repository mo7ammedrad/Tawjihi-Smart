/**
 * Paginate an array of items.
 * @param {Array} items - The array of items to paginate.
 * @param {number} currentPage - Current active page (1-based).
 * @param {number} itemsPerPage - Number of items per page.
 * @returns {{currentItems: Array, totalPages: number, indexOfFirstItem: number, indexOfLastItem: number}}
 */
export const paginate = (items, currentPage, itemsPerPage) => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    return {
        currentItems,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
    };
};
  