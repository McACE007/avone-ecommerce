import { Product } from "@/types/product.types";
import { API_ROUTES } from "@/utils/api.util";
import axios, { isAxiosError } from "axios";
import { create } from "zustand";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  getProductById: (productId: string) => Promise<Product>;
}

const axoisInstance = axios.create({
  baseURL: API_ROUTES.PRODUCTS,
  withCredentials: true,
});

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  getProductById: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axoisInstance.get(`/${productId}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to fetch product",
        isLoading: false,
      });
    }
  },
}));
