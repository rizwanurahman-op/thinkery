import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { MenuData, MenuItem, MenuCategoryItem } from '@/types';

const DATA_PATH = join(process.cwd(), 'src', 'data', 'menu.json');

// ─── Read ───

function readStore(): MenuData {
    if (!existsSync(DATA_PATH)) {
        const empty: MenuData = { categories: [], items: [] };
        writeFileSync(DATA_PATH, JSON.stringify(empty, null, 2), 'utf-8');
        return empty;
    }
    const raw = readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as MenuData;
}

function writeStore(data: MenuData): void {
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Public API (read-only, for public pages) ───

export function getPublicMenuData(): MenuData {
    const data = readStore();
    return {
        categories: data.categories
            .sort((a, b) => a.sortOrder - b.sortOrder),
        items: data.items
            .filter((item) => item.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder),
    };
}

// ─── Admin: Categories ───

export function getAllCategories(): MenuCategoryItem[] {
    return readStore().categories.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoryById(id: string): MenuCategoryItem | undefined {
    return readStore().categories.find((c) => c.id === id);
}

export function createCategory(category: MenuCategoryItem): MenuCategoryItem {
    const data = readStore();
    // Prevent duplicate IDs
    if (data.categories.some((c) => c.id === category.id)) {
        throw new Error(`Category with id "${category.id}" already exists`);
    }
    data.categories.push(category);
    writeStore(data);
    return category;
}

export function updateCategory(id: string, updates: Partial<Omit<MenuCategoryItem, 'id'>>): MenuCategoryItem {
    const data = readStore();
    const index = data.categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Category "${id}" not found`);
    data.categories[index] = { ...data.categories[index], ...updates };
    writeStore(data);
    return data.categories[index];
}

export function deleteCategory(id: string): void {
    const data = readStore();
    const hasItems = data.items.some((item) => item.categoryId === id);
    if (hasItems) {
        throw new Error(`Cannot delete category "${id}" — it still has menu items. Move or delete them first.`);
    }
    data.categories = data.categories.filter((c) => c.id !== id);
    writeStore(data);
}

// ─── Admin: Menu Items ───

export function getAllItems(): MenuItem[] {
    return readStore().items.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getItemById(id: string): MenuItem | undefined {
    return readStore().items.find((item) => item.id === id);
}

export function createItem(item: MenuItem): MenuItem {
    const data = readStore();
    if (data.items.some((i) => i.id === item.id)) {
        throw new Error(`Item with id "${item.id}" already exists`);
    }
    // Validate category exists
    if (!data.categories.some((c) => c.id === item.categoryId)) {
        throw new Error(`Category "${item.categoryId}" not found`);
    }
    data.items.push(item);
    writeStore(data);
    return item;
}

export function updateItem(id: string, updates: Partial<Omit<MenuItem, 'id'>>): MenuItem {
    const data = readStore();
    const index = data.items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Item "${id}" not found`);
    // Validate category if changed
    if (updates.categoryId && !data.categories.some((c) => c.id === updates.categoryId)) {
        throw new Error(`Category "${updates.categoryId}" not found`);
    }
    data.items[index] = { ...data.items[index], ...updates };
    writeStore(data);
    return data.items[index];
}

export function deleteItem(id: string): void {
    const data = readStore();
    data.items = data.items.filter((i) => i.id !== id);
    writeStore(data);
}
