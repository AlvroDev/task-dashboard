import { useState } from "react";
import type { Filters } from "@/types/filters";

const initialFilters: Filters = {
    search: '',
    completed: null,
    userId: null,
};

export const useFilters = () => {
    const [filters, setFilters] = useState<Filters>(initialFilters);

    const setSearch = (search: string) => {
        setFilters(prev => ({ ...prev, search }));
    }

    const setCompleted = (completed: boolean | null) => {
        setFilters(prev => ({ ...prev, completed }));
    }

    const setUserId = (userId: number | null) => {
        setFilters(prev => ({ ...prev, userId }));
    }

    const resetFilters = () => {
        setFilters(initialFilters);
    }

    return { filters, setSearch, setCompleted, setUserId, resetFilters };
}