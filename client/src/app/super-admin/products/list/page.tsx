"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSuperAdminProductStore } from "@/stores/useSuperAdminProductStore";
import {
  Loader,
  Loader2,
  LoaderCircle,
  PackageX,
  Pencil,
  SplinePointer,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

function SuperAdminProductsListingPage() {
  const { products, getAllProducts, isLoading, deleteProduct, error } =
    useSuperAdminProductStore();

  const router = useRouter();

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  async function handleDeleteProduct(productId: string) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const success = await deleteProduct(productId);
      if (!success) {
        toast.error(error);
        return;
      }

      await getAllProducts();
      toast.success("Product deleted successfully!");
    }
  }

  if (isLoading)
    return (
      <div className="h-full flex justify-center items-center">
        <LoaderCircle className="animate-spin size-10 text-blue-800" />
      </div>
    );

  return (
    <div className="p-6 h-full">
      <div className="flex flex-col gap-6 h-full">
        <header className="flex items-center justify-between">
          <h1>All Products</h1>
          <Button>Add New Product</Button>
        </header>
        {products.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 p-10 text-muted-foreground my-auto">
            <PackageX size={48} />
            <p className="text-lg font-semibold">No products found</p>
            <p className="text-sm">
              Click "Add New Product" to create your first product.
            </p>
          </div>
        )}
        {products.length > 0 && (
          <div className="rounded-lg border bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-l bg-gray-100 overflow-hidden">
                            {product.images[0] && (
                              <Image
                                src={product.images[0]}
                                alt="Product Image"
                                width={60}
                                height={60}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-muted-foreground text-sm">
                              Sizes: {product.sizes.join(", ")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <p>{product.stock} Item left</p>
                      </TableCell>
                      <TableCell>
                        <p>{product.category.toLocaleUpperCase()}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button
                            variant={"ghost"}
                            onClick={() =>
                              router.push(
                                `/super-admin/products/add?id=${product.id}`
                              )
                            }
                            size={"icon"}
                          >
                            <Pencil size={4} />
                          </Button>
                          <Button
                            onClick={() => handleDeleteProduct(product.id)}
                            variant={"ghost"}
                            size={"icon"}
                          >
                            <Trash2 size={4} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdminProductsListingPage;
