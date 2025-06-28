import { Product } from "@/types/product.types";
import { API_ROUTES } from "@/utils/api.util";
import axios, { isAxiosError } from "axios";
import { create } from "zustand";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  getAllProducts: () => Promise<void>;
  createProduct: (productData: FormData) => Promise<void>;
  updateProduct: (productId: string, productData: FormData) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

const axoisInstance = axios.create({
  baseURL: API_ROUTES.SUPER_ADMIN_PRODUCTS,
  withCredentials: true,
});

export const useSuperAdminProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  getAllProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axoisInstance.get("/");
      set({ isLoading: false, products: response.data.products });
    } catch (error) {
      set({
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to fetch products",
        isLoading: false,
      });
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
    } catch (error) {
      set({
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to create product",
        isLoading: false,
      });
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
    } catch (error) {
      set({
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to update product",
        isLoading: false,
      });
    }
  },
  deleteProduct: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axoisInstance.delete(`/${productId}`);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to delete product",
        isLoading: false,
      });
    }
  },
}));
