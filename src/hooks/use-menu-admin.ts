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
        staleTime: 0, // always consider stale so refetch happens after mutations
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
        // ✅ Optimistic: instantly add to list before server confirms
        onMutate: async (newCat) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'categories'] });
            const previous = queryClient.getQueryData<MenuCategoryItem[]>(['admin', 'categories']);
            queryClient.setQueryData<MenuCategoryItem[]>(['admin', 'categories'], (old = []) => [
                ...old,
                { id: newCat.id || '', label: newCat.label || '', icon: newCat.icon || '📋', sortOrder: newCat.sortOrder ?? 999 },
            ]);
            return { previous };
        },
        onError: (_err, _vars, context) => {
            // Rollback on failure
            if (context?.previous) queryClient.setQueryData(['admin', 'categories'], context.previous);
        },
        onSettled: () => {
            // Always sync with server after mutation completes
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
        // ✅ Optimistic: instantly update in-place
        onMutate: async (updates) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'categories'] });
            const previous = queryClient.getQueryData<MenuCategoryItem[]>(['admin', 'categories']);
            queryClient.setQueryData<MenuCategoryItem[]>(['admin', 'categories'], (old = []) =>
                old.map((cat) => (cat.id === updates.id ? { ...cat, ...updates } : cat))
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['admin', 'categories'], context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            apiFetch<void>(`/api/admin/categories/${id}`, { method: 'DELETE' }),
        // ✅ Optimistic: instantly remove from list
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'categories'] });
            const previous = queryClient.getQueryData<MenuCategoryItem[]>(['admin', 'categories']);
            queryClient.setQueryData<MenuCategoryItem[]>(['admin', 'categories'], (old = []) =>
                old.filter((cat) => cat.id !== id)
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['admin', 'categories'], context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        },
    });
}

// ─── Menu Items ───

export function useMenuItems() {
    return useQuery({
        queryKey: ['admin', 'items'],
        queryFn: () => apiFetch<MenuItem[]>('/api/admin/items'),
        staleTime: 0, // always consider stale so refetch happens after mutations
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
        // ✅ Optimistic: instantly add to items list
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'items'] });
            const previous = queryClient.getQueryData<MenuItem[]>(['admin', 'items']);
            const tempItem: MenuItem = {
                id: newItem.id || `temp-${Date.now()}`,
                name: newItem.name || '',
                description: newItem.description || '',
                shortDesc: newItem.shortDesc || '',
                price: newItem.price,
                categoryId: newItem.categoryId || '',
                badge: newItem.badge,
                image: newItem.image,
                imagePublicId: newItem.imagePublicId,
                isActive: newItem.isActive ?? true,
                sortOrder: newItem.sortOrder ?? 999,
            };
            queryClient.setQueryData<MenuItem[]>(['admin', 'items'], (old = []) => [...old, tempItem]);
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['admin', 'items'], context.previous);
        },
        onSettled: () => {
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
        // ✅ Optimistic: instantly update in-place
        onMutate: async (updates) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'items'] });
            const previous = queryClient.getQueryData<MenuItem[]>(['admin', 'items']);
            queryClient.setQueryData<MenuItem[]>(['admin', 'items'], (old = []) =>
                old.map((item) => (item.id === updates.id ? { ...item, ...updates } : item))
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['admin', 'items'], context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
        },
    });
}

export function useDeleteItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            apiFetch<void>(`/api/admin/items/${id}`, { method: 'DELETE' }),
        // ✅ Optimistic: instantly remove from list
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'items'] });
            const previous = queryClient.getQueryData<MenuItem[]>(['admin', 'items']);
            queryClient.setQueryData<MenuItem[]>(['admin', 'items'], (old = []) =>
                old.filter((item) => item.id !== id)
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['admin', 'items'], context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
        },
    });
}
