"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UpdateSettingsInput,
  updateSettingsSchema,
} from "@/schemas/settingsSchemas";
import { useSuperAdminProductStore } from "@/stores/useSuperAdminProductStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Upload } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

function SuperAdminSettingsPage() {
  const form = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      images: [],
    },
  });

  const { products, getAllProducts } = useSuperAdminProductStore();
  const pageLoadRef = useRef(true);

  useEffect(() => {
    if (pageLoadRef.current) {
      getAllProducts();
      pageLoadRef.current = false;
    }
  }, []);

  const onSubmit = async (values: UpdateSettingsInput) => {
    console.table(values);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <header className="">
          <h1 className="text-lg font-bold">Settings & Features</h1>
        </header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Images</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Label
                            htmlFor="image-upload"
                            className="flex items-center justify-center w-full h-32 px-4 transition border-2 border-gray-200 hover:border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:bg-gray-50 group"
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <Upload className="h-7 w-7 text-gray-400"></Upload>
                              <span className="text-sm text-gray-500">
                                Click to upload Feature Images
                              </span>
                            </div>
                          </Label>
                          <Input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                              e.target.files &&
                              form.setValue("images", e.target.files, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                          ></Input>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />

              <div>
                <h2>Select upto 8 products to feature on client panels</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <div key={product.id} className="relative">
                      <div className="absolute top-2 right-2">
                        <Checkbox checked={true}></Checkbox>
                      </div>
                      <div className="space-y-2">
                        <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-md"
                            ></img>
                          ) : (
                            <ImageIcon className="h-8 w-8 text-gray-500" />
                          )}
                        </div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                        <p className="font-bold">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit">Update</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default SuperAdminSettingsPage;
