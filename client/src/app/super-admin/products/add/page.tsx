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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  brands,
  categories,
  colors,
  sizes,
} from "@/constants/product.constants";
import { cn } from "@/lib/utils";
import { createProductSchema } from "@/schemas/product.schema";
import { useSuperAdminProductStore } from "@/stores/useSuperAdminProductStore";
import { CreateProductInput } from "@/types/product.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Upload } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function SuperAdminManageProductsPage() {
  const form = useForm<CreateProductInput>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      gender: "",
      sizes: [],
      colors: [],
      price: 0,
      stock: 0,
    },
    resolver: zodResolver(createProductSchema),
  });
  const router = useRouter();
  const { createProduct, error, isLoading } = useSuperAdminProductStore();

  const onSubmit = async (formInput: CreateProductInput) => {
    console.table(formInput);
    const formData = new FormData();
    Object.entries(formInput).forEach(([key, value]) => {
      if (key === "sizes" || key === "colors")
        formData.append(key, (value as string[]).join(", "));
      else if (key === "images") {
        Array.from(value as FileList).forEach((file) =>
          formData.append(key, file)
        );
      } else formData.append(key, String(value));
    });

    const success = await createProduct(formData);

    if (!success) {
      toast.error(error);
      return;
    }
    toast.success("Product created successfully!");
    router.push("/super-admin/products/list");
  };

  const images = form.watch("images");

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="">Add Product</h1>
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-400 p-12">
            <div className="text-center">
              <Upload className="mx-auto size-12 text-gray-400" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormLabel>Click to browse</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={(e) =>
                            form.setValue("images", e.target.files, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {(form.getValues("images") as FileList)?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from(form.getValues("images") as FileList).map(
                  (file, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover rounded-md"
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Product Name" />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((item) => (
                        <SelectItem key={item} value={item.toLowerCase()}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-[150px]"
                    placeholder="Product description"
                  />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item} value={item.toLowerCase()}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Man</SelectItem>
                      <SelectItem value="women">Woman</SelectItem>
                      <SelectItem value="kids">Kids</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sizes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sizes</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    {sizes.map((item) => {
                      const isSelected = field.value.includes(item);
                      return (
                        <Button
                          key={item}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "cursor-pointer size-8 hover:scale-120 transition-all duration-90"
                          )}
                          onClick={() => {
                            if (isSelected) {
                              field.onChange(
                                field.value.filter((v) => v !== item)
                              );
                            } else {
                              field.onChange([...field.value, item]);
                            }
                          }}
                        >
                          {item}
                        </Button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colors</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    {colors.map((item) => {
                      const isSelected = field.value.includes(item.name);
                      return (
                        <Button
                          key={item.name}
                          type="button"
                          size="sm"
                          className={cn(
                            "cursor-pointer size-8 hover:scale-110 transition-all duration-90 rounded-full",
                            `hover:${item.class}`,
                            item.class,
                            isSelected && `ring-1 ring-primary ring-offset-1`
                          )}
                          onClick={() => {
                            if (isSelected) {
                              field.onChange(
                                field.value.filter((v) => v !== item.name)
                              );
                            } else {
                              field.onChange([...field.value, item.name]);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Price</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Product Price" />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Product Stock" />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-1.5 col-span-2">
            {isLoading ? "CREATING PRODUCT..." : "CREATE PRODUCT"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SuperAdminManageProductsPage;
