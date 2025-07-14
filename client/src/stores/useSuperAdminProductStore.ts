import { Product } from "@/types/product.types";
import { API_ROUTES } from "@/utils/api.util";
import axios, { isAxiosError } from "axios";
import { fa } from "zod/v4/locales";
import { create } from "zustand";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  getAllProducts: () => Promise<boolean>;
  createProduct: (productData: FormData) => Promise<boolean>;
  updateProduct: (productId: string, productData: FormData) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
}

const axoisInstance = axios.create({
  baseURL: API_ROUTES.SUPER_ADMIN_PRODUCTS,
  withCredentials: true,
});

export const useSuperAdminProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: true,
  error: null,
  getAllProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axoisInstance.get("/");
      set({ isLoading: false, products: response.data.products });
      return true;
    } catch (error) {
      set({
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to fetch products",
        isLoading: false,
      });
      return false;
    }
  },
  createProduct: async (productData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await axoisInstance.post("/", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to create product",
        isLoading: false,
      });
      return false;
    }
  },
  updateProduct: async (productId: string, productData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await axoisInstance.put(`/${productId}`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to update product",
        isLoading: false,
      });
      return false;
    }
  },
  deleteProduct: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axoisInstance.delete(`/${productId}`);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to delete product",
        isLoading: false,
      });
      return false;
    }
  },
}));
