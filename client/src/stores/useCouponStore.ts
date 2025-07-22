import { CreateCouponInput } from "@/schemas/couponSchemas";
import { API_ROUTES } from "@/utils/api.util";
import axios, { isAxiosError } from "axios";
import { create } from "zustand";

export type Coupon = {
  id: string;
  code: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
};

type CouponStore = {
  coupons: Coupon[];
  isLoading: boolean;
  error: string | null;
  fetchAllCoupons: () => Promise<boolean>;
  createCoupon: (values: CreateCouponInput) => Promise<Coupon | null>;
  deleteCoupon: (couponId: string) => Promise<boolean>;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.COUPON,
  withCredentials: true,
});

export const useCouponStore = create<CouponStore>((set) => ({
  coupons: [],
  isLoading: false,
  error: null,
  fetchAllCoupons: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("");
      set({ isLoading: false, coupons: response.data.coupons });
      return true;
    } catch (error) {
      console.error(error);
      set({
        isLoading: false,
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to fetch coupon list",
      });
      return false;
    }
  },
  createCoupon: async (values) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("", { ...values });
      set({ isLoading: false });
      return response.data.coupon;
    } catch (error) {
      console.error(error);
      set({
        isLoading: false,
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to create coupon",
      });
      return null;
    }
  },
  deleteCoupon: async (couponId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/{${couponId}}`);
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error(error);
      set({
        isLoading: false,
        error: isAxiosError(error)
          ? error.response?.data.error
          : "Failed to delete coupon",
      });
      return false;
    }
  },
}));
