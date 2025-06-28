"use client";
import Image from "next/image";
import banner from "../../../../public/images/banner2.jpg";
import logo from "../../../../public/images/logo1.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { userRegistrationSchema } from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const form = useForm<z.infer<typeof userRegistrationSchema>>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { register } = useAuthStore();

  async function onSubmit({
    name,
    email,
    password,
  }: z.infer<typeof userRegistrationSchema>) {
    const userId = await register(name, email, password);

    if (!userId) {
      toast.error("Registration Failed, Please try again.");
      return;
    }
    toast.success("Registered successfully!");
    router.push("/auth/login");
  }

  return (
    <div className="min-h-screen bg-[#fff6f4] flex">
      <div className="hidden lg:block w-1/2 bg-[#ffede1] relative overflow-hidden">
        <Image
          src={banner}
          alt="Register"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-center">
            <Image src={logo} alt="Logo" width={200} height={50} />
          </div>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your name"
                        className="bg-[#ffede1]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your email"
                        className="bg-[#ffede1]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="bg-[#ffede1]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full bg-black hover:bg-black/80 transition-all text-white"
                type="submit"
              >
                {form.formState.isSubmitting
                  ? "CREATING ACCOUNT..."
                  : "CREATE ACCOUNT"}
              </Button>

              <p className="text-center text-[#3f3d56] text-sm">
                Already have an account!{" "}
                <Link
                  className="text-black font-bold hover:underline"
                  href={"/auth/login"}
                >
                  Sign In
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
