"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateCouponInput, createCouponSchema } from "@/schemas/couponSchemas";
import { useCouponStore } from "@/stores/useCouponStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function SuperAdminManageCouponsPage() {
  const { isLoading, createCoupon, error } = useCouponStore();
  const form = useForm<CreateCouponInput>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      code: "",
      discountPercentage: 10,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      usageLimit: 1,
    },
  });
  const router = useRouter();

  async function onSubmit(values: CreateCouponInput) {
    const coupon = await createCoupon(values);

    if (!coupon) {
      toast.error(error);
      return;
    }
    toast.success("Coupon created successfully!");
    router.push("/super-admin/coupons/list");
  }

  const handleCreateUniqueCode = () => {
    const characters = "QWERTYUIOPASDFGHJKLZXCVBNM123456789";
    let result = "";
    for (let i = 0; i < 8; i++)
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    form.setValue("code", result);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>Create New Coupon</h1>
        </header>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 space-y-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value.toISOString().slice(0, 10)}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input {...field} placeholder="Enter coupon code" />
                    <Button type="button" onClick={handleCreateUniqueCode}>
                      Create Unique Code
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter discount percentage" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usageLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usage Limit</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter usage limit" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} className="w-full" type="submit">
            {isLoading ? "CREATING COUPON..." : "CREATE COUPON"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SuperAdminManageCouponsPage;
