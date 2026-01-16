import { API_ROUTES } from "@/utils/api.util";
import axios, { isAxiosError } from "axios";
import { Form } from "react-hook-form";
import { create } from "zustand";

type FeatureBanner = {
  id: string;
  imageUrl: string;
};

type FeaturedProduct = {
  id: string;
  name: string;
  price: string;
  images: string[];
};

type SettingsState = {
  banners: FeatureBanner[];
  featuredProducts: FeaturedProduct[];
  isLoading: boolean;
  error: string | null;
  fetchBanners: () => Promise<boolean>;
  fetchfeaturedProducts: () => Promise<boolean>;
  addBanners: (files: File[]) => Promise<boolean>;
  updatefeaturedProducts: (productIds: string[]) => Promise<boolean>;
};

const axiosInstace = axios.create({
  baseURL: API_ROUTES.SETTINGS,
  withCredentials: true,
});

export const useSettingsStore = create<SettingsState>((set) => ({
  banners: [],
  featuredProducts: [],
  isLoading: false,
  error: null,
  fetchBanners: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstace.get("/fetch-feature-banners");
      set({ isLoading: false, banners: response.data.banners });
      return true;
    } catch (error) {
      console.error(error);
      set({
        isLoading: false,
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to fetch feature banners",
      });
      return false;
    }
  },
  fetchfeaturedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstace.get("/fetch-featured-products");
      set({
        isLoading: false,
        featuredProducts: response.data.featuredProducts,
      });
      return true;
    } catch (error) {
      console.error(error);
      set({
        isLoading: false,
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to fetch featured products",
      });
      return false;
    }
  },

  addBanners: async (files: File[]) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      await axiosInstace.post("/add-feature-banners", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error(error);
      set({
        isLoading: false,
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to add feature banners",
      });
      return false;
    }
  },
  updatefeaturedProducts: async (productIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstace.put("/update-featured-products", {
        productIds,
      });
      set({ isLoading: false, banners: response.data.banners });
      return true;
    } catch (error) {
      console.error(error);
      set({
        isLoading: false,
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to update featured products",
      });
      return false;
    }
  },
}));
