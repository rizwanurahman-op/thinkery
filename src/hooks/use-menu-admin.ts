import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MenuItem, MenuCategoryItem, ApiResponse } from '@/types';

// ─── Fetcher utility ───

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const json = await res.json() as ApiResponse<T>;
    if (!json.success) throw new Error(json.error || 'Request failed');
    return json.data as T;
}

// ─── Auth ───

export function useAuthCheck() {
    return useQuery({
        queryKey: ['admin', 'auth'],
        queryFn: async () => {
            const res = await fetch('/api/admin/check');
            const json = await res.json();
            return json.authenticated as boolean;
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ identifier, password }: { identifier: string; password: string }) => {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message || 'Login failed');
            return json;
        },
        onSuccess: () => {
            queryClient.setQueryData(['admin', 'auth'], true);
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
        },
        onSuccess: () => {
            queryClient.setQueryData(['admin', 'auth'], false);
        },
    });
}

// ─── Categories ───

export function useCategories() {
    return useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: () => apiFetch<MenuCategoryItem[]>('/api/admin/categories'),
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<MenuCategoryItem>) =>
            apiFetch<MenuCategoryItem>('/api/admin/categories', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: Partial<MenuCategoryItem> & { id: string }) =>
            apiFetch<MenuCategoryItem>(`/api/admin/categories/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            apiFetch<void>(`/api/admin/categories/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        },
    });
}

// ─── Menu Items ───

export function useMenuItems() {
    return useQuery({
        queryKey: ['admin', 'items'],
        queryFn: () => apiFetch<MenuItem[]>('/api/admin/items'),
    });
}

export function useCreateItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<MenuItem>) =>
            apiFetch<MenuItem>('/api/admin/items', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
        },
    });
}

export function useUpdateItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: Partial<MenuItem> & { id: string }) =>
            apiFetch<MenuItem>(`/api/admin/items/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
        },
    });
}

export function useDeleteItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            apiFetch<void>(`/api/admin/items/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
        },
    });
}
