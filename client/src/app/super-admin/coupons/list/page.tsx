"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useCouponStore } from "@/stores/useCouponStore";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

function SuperAdminCouponsListingPage() {
  const { isLoading, fetchAllCoupons, coupons, error, deleteCoupon } =
    useCouponStore();
  const fetchAllCouponRef = useRef(false);
  const router = useRouter();

  const handleDeleteCouponCode = async (couponId: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const success = await deleteCoupon(couponId);
      if (!success) {
        toast.error(error);
        return;
      }

      await fetchAllCoupons();
      toast.success("Coupon deleted successfully!");
    }
  };

  useEffect(() => {
    if (fetchAllCouponRef.current === false) {
      fetchAllCoupons();
      fetchAllCouponRef.current = true;
    }
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1>All Coupons</h1>
        <Button onClick={() => router.push("/super-admin/coupons/add")}>
          Add Coupon
        </Button>
      </header>

      {coupons && coupons.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <p className="font-semibold">{coupon.code}</p>
                </TableCell>
                <TableCell>
                  <p>{coupon.discountPercentage}%</p>
                </TableCell>
                <TableCell>
                  <p>
                    {coupon.usageCount}/{coupon.usageLimit}
                  </p>
                </TableCell>
                <TableCell>
                  <p>{format(new Date(coupon.startDate), "dd MMM yyyy")}</p>
                </TableCell>
                <TableCell>
                  <p>{format(new Date(coupon.endDate), "dd MMM yyyy")}</p>
                </TableCell>
                <TableCell>
                  {new Date(coupon.startDate) <= new Date(coupon.endDate) ? (
                    <Badge className="bg-green-500">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500">Expired</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => handleDeleteCouponCode(coupon.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default SuperAdminCouponsListingPage;
