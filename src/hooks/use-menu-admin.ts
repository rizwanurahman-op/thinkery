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
        staleTime: 0,
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
        // Step 1: instantly add a placeholder while waiting for server
        onMutate: async (newCat) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'categories'] });
            const previous = queryClient.getQueryData<MenuCategoryItem[]>(['admin', 'categories']);
            queryClient.setQueryData<MenuCategoryItem[]>(['admin', 'categories'], (old = []) => [
                ...old,
                { id: newCat.id || `__temp__`, label: newCat.label || '', icon: newCat.icon || '📋', sortOrder: newCat.sortOrder ?? 999 },
            ]);
            return { previous };
        },
        // Step 2: replace placeholder with the actual confirmed server data
        onSuccess: (created) => {
            queryClient.setQueryData<MenuCategoryItem[]>(['admin', 'categories'], (old = []) => {
                const withoutTemp = old.filter((c) => !c.id.startsWith('__temp__') && c.id !== created.id);
                return [...withoutTemp, created].sort((a, b) => a.sortOrder - b.sortOrder);
            });
            // Step 3: delayed background sync (gives Blob CDN ~5s to propagate)
            // so the refetch doesn't overwrite the confirmed data with stale CDN data
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            }, 5000);
        },
        // Rollback on failure
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['admin', 'categories'], context.previous);
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
        onMutate: async (updates) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'categories'] });
            const previous = queryClient.getQueryData<MenuCategoryItem[]>(['admin', 'categories']);
            queryClient.setQueryData<MenuCategoryItem[]>(['admin', 'categories'], (old = []) =>
                old.map((cat) => (cat.id === updates.id ? { ...cat, ...updates } : cat))
            );
            return { previous };
        },
        onSuccess: (updated) => {
            // Replace with server-confirmed data
            queryClient.setQueryData<MenuCategoryItem[]>(['admin', 'categories'], (old = []) =>
                old.map((cat) => (cat.id === updated.id ? updated : cat))
            );
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            }, 5000);
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['admin', 'categories'], context.previous);
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            apiFetch<void>(`/api/admin/categories/${id}`, { method: 'DELETE' }),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'categories'] });
            const previous = queryClient.getQueryData<MenuCategoryItem[]>(['admin', 'categories']);
            queryClient.setQueryData<MenuCategoryItem[]>(['admin', 'categories'], (old = []) =>
                old.filter((cat) => cat.id !== id)
            );
            return { previous };
        },
        onSuccess: () => {
            // Delete is confirmed — delay sync to avoid CDN stale read
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            }, 5000);
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['admin', 'categories'], context.previous);
        },
    });
}

// ─── Menu Items ───

export function useMenuItems() {
    return useQuery({
        queryKey: ['admin', 'items'],
        queryFn: () => apiFetch<MenuItem[]>('/api/admin/items'),
        staleTime: 0,
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
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'items'] });
            const previous = queryClient.getQueryData<MenuItem[]>(['admin', 'items']);
            const tempItem: MenuItem = {
                id: `__temp__${Date.now()}`,
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
        onSuccess: (created) => {
            // Replace optimistic placeholder with server-confirmed item
            queryClient.setQueryData<MenuItem[]>(['admin', 'items'], (old = []) => {
                const withoutTemp = old.filter((i) => !i.id.startsWith('__temp__') && i.id !== created.id);
                return [...withoutTemp, created].sort((a, b) => a.sortOrder - b.sortOrder);
            });
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
            }, 5000);
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['admin', 'items'], context.previous);
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
        onMutate: async (updates) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'items'] });
            const previous = queryClient.getQueryData<MenuItem[]>(['admin', 'items']);
            queryClient.setQueryData<MenuItem[]>(['admin', 'items'], (old = []) =>
                old.map((item) => (item.id === updates.id ? { ...item, ...updates } : item))
            );
            return { previous };
        },
        onSuccess: (updated) => {
            queryClient.setQueryData<MenuItem[]>(['admin', 'items'], (old = []) =>
                old.map((item) => (item.id === updated.id ? updated : item))
            );
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
            }, 5000);
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['admin', 'items'], context.previous);
        },
    });
}

export function useDeleteItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            apiFetch<void>(`/api/admin/items/${id}`, { method: 'DELETE' }),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'items'] });
            const previous = queryClient.getQueryData<MenuItem[]>(['admin', 'items']);
            queryClient.setQueryData<MenuItem[]>(['admin', 'items'], (old = []) =>
                old.filter((item) => item.id !== id)
            );
            return { previous };
        },
        onSuccess: () => {
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
            }, 5000);
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['admin', 'items'], context.previous);
        },
    });
}
