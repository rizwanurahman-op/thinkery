import { join } from 'path';
import { readData, writeData, readDataSync } from '@/lib/data-store';
import type { MenuData, MenuItem, MenuCategoryItem } from '@/types';

const LOCAL_PATH = join(process.cwd(), 'src', 'data', 'menu.json');
const BLOB_KEY = 'thinkery/menu.json';

const EMPTY: MenuData = { categories: [], items: [] };

// ─── Internal Helpers ───

async function readStore(): Promise<MenuData> {
    return readData<MenuData>(LOCAL_PATH, BLOB_KEY, EMPTY);
}

async function writeStore(data: MenuData): Promise<void> {
    await writeData<MenuData>(LOCAL_PATH, BLOB_KEY, data);
}

// ─── Public API — ASYNC (reads from Redis for always-live data) ───

export async function getPublicMenuData(): Promise<MenuData> {
    const data = await readData<MenuData>(LOCAL_PATH, BLOB_KEY, EMPTY);
    return {
        categories: data.categories.sort((a, b) => a.sortOrder - b.sortOrder),
        items: data.items
            .filter((item) => item.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder),
    };
}

// ─── Admin: Categories (all async) ───

export async function getAllCategories(): Promise<MenuCategoryItem[]> {
    const data = await readStore();
    return data.categories.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryById(id: string): Promise<MenuCategoryItem | undefined> {
    const data = await readStore();
    return data.categories.find((c) => c.id === id);
}

export async function createCategory(category: MenuCategoryItem): Promise<MenuCategoryItem> {
    const data = await readStore();
    if (data.categories.some((c) => c.id === category.id)) {
        throw new Error(`Category with id "${category.id}" already exists`);
    }
    data.categories.push(category);
    await writeStore(data);
    return category;
}

export async function updateCategory(
    id: string,
    updates: Partial<Omit<MenuCategoryItem, 'id'>>,
): Promise<MenuCategoryItem> {
    const data = await readStore();
    const index = data.categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Category "${id}" not found`);
    data.categories[index] = { ...data.categories[index], ...updates };
    await writeStore(data);
    return data.categories[index];
}

export async function deleteCategory(id: string): Promise<void> {
    const data = await readStore();
    const hasItems = data.items.some((item) => item.categoryId === id);
    if (hasItems) {
        throw new Error(
            `Cannot delete category "${id}" — it still has menu items. Move or delete them first.`,
        );
    }
    data.categories = data.categories.filter((c) => c.id !== id);
    await writeStore(data);
}

export async function reorderCategories(orderedIds: string[]): Promise<void> {
    const data = await readStore();
    orderedIds.forEach((id, index) => {
        const cat = data.categories.find((c) => c.id === id);
        if (cat) cat.sortOrder = index;
    });
    await writeStore(data);
}

// ─── Admin: Menu Items (all async) ───

export async function getAllItems(): Promise<MenuItem[]> {
    const data = await readStore();
    return data.items.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getItemById(id: string): Promise<MenuItem | undefined> {
    const data = await readStore();
    return data.items.find((item) => item.id === id);
}

export async function createItem(item: MenuItem): Promise<MenuItem> {
    const data = await readStore();
    if (data.items.some((i) => i.id === item.id)) {
        throw new Error(`Item with id "${item.id}" already exists`);
    }
    if (!data.categories.some((c) => c.id === item.categoryId)) {
        throw new Error(`Category "${item.categoryId}" not found`);
    }
    data.items.push(item);
    await writeStore(data);
    return item;
}

export async function updateItem(
    id: string,
    updates: Partial<Omit<MenuItem, 'id'>>,
): Promise<MenuItem> {
    const data = await readStore();
    const index = data.items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Item "${id}" not found`);
    if (updates.categoryId && !data.categories.some((c) => c.id === updates.categoryId)) {
        throw new Error(`Category "${updates.categoryId}" not found`);
    }
    data.items[index] = { ...data.items[index], ...updates };
    await writeStore(data);
    return data.items[index];
}

export async function deleteItem(id: string): Promise<void> {
    const data = await readStore();
    data.items = data.items.filter((i) => i.id !== id);
    await writeStore(data);
}

export async function reorderItems(orderedIds: string[]): Promise<void> {
    const data = await readStore();
    orderedIds.forEach((id, index) => {
        const item = data.items.find((i) => i.id === id);
        if (item) item.sortOrder = index;
    });
    await writeStore(data);
}
