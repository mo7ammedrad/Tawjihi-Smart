import { normalizeArabic } from "./normlizeArabic";

export const matchName = (course, filterNames) => {
    if (filterNames.length === 0) return true;

    const courseName = normalizeArabic((course.name || "").toLowerCase());
    return filterNames.some((name) =>
        courseName.includes(normalizeArabic(name.toLowerCase()))
    );
};

export const matchBranch = (course, filterBranches) => {
    if (filterBranches.length === 0) return true;

    const courseBranches = (course.branches || []).map((b) =>
        normalizeArabic(b.name.toLowerCase())
    );
    return filterBranches.some((branch) =>
        courseBranches.includes(normalizeArabic(branch.toLowerCase()))
    );
};

export const matchSubject = (course, filterSubjects) => {
    if (filterSubjects.length === 0) return true;

    const subject = normalizeArabic(
        course.subject?.name?.toLowerCase() || ""
    );
    return filterSubjects.some((s) =>
        subject.includes(normalizeArabic(s.toLowerCase()))
    );
};

export const matchPrice = (course, filterPrices) => {
    if (filterPrices.length === 0) return true;

    return filterPrices.some((priceFilter) => {
        if (priceFilter === "free") return course.price === 0;
        return course.price <= parseInt(priceFilter, 10);
    });
};

export const matchSearch = (course, searchText) => {
    if (!searchText) return true;

    const courseName = normalizeArabic((course.name || "").toLowerCase());
    return courseName.includes(normalizeArabic(searchText.toLowerCase()));
};

export const filterCourses = (courses, filters, searchText) => {
    return courses.filter((course) => {
        return (
            matchName(course, filters.names) &&
            matchBranch(course, filters.branches) &&
            matchSubject(course, filters.subjects) &&
            matchPrice(course, filters.prices) &&
            matchSearch(course, searchText)
        );
    });
};
