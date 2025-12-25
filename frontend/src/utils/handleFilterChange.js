/**
 * Updates filters object based on checkbox changes.
 * @param {object} filters - current filters state
 * @param {string} id - filter id in the format "type-value"
 * @param {boolean} isChecked - checkbox checked state
 * @returns {object} updated filters state
 */
export const updateFilters = (filters, id, isChecked) => {
    const [type, value] = id.split("-");
    const updated = { ...filters };

    if (type === "branch") {
        updated.branches = isChecked
            ? [...filters.branches, value]
            : filters.branches.filter(v => v !== value);
    } else if (type === "subject") {
        updated.subjects = isChecked
            ? [...filters.subjects, value]
            : filters.subjects.filter(v => v !== value);
    } else if (type === "price") {
        updated.prices = isChecked
            ? [...filters.prices, value]
            : filters.prices.filter(v => v !== value);
    }

    return updated;
};
  