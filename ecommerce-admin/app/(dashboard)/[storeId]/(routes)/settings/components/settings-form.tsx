"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useCustomForm,
} from "@/components/ui/form";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

/**
 * Settings form component that allows updating store details
 * and deletion of the store
 */
export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  }) as UseFormReturn<SettingsFormValues>;

  // Update the onSubmit handler to properly handle async submission
  const onSubmit = React.useCallback(async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Store updated.");
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Settings update error:", error);
    } finally {
      setLoading(false);
    }
  }, [params.storeId, router]);

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Store deleted.");
    } catch (error) {
      toast.error("Make sure you removed all products and categories first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6 md:p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <Heading 
            title="Store Details" 
            description="Update your store information" 
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
            disabled={loading}
            className="ml-4"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-full">
          <Form 
            form={form} 
            onSubmit={onSubmit}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-sm font-medium mb-2">Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Store name"
                        className="w-full h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="mt-2" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end pt-6 md:pt-8">
              <Button 
                disabled={loading} 
                type="submit"
                className="min-w-[120px] h-10"
              >
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6 md:p-8">
        <div className="mb-4 md:mb-6">
          <Heading 
            title="API Access" 
            description="API endpoints for your store" 
            size="sm" 
          />
        </div>
        <div className="space-y-4">
          <ApiAlert
            title="NEXT_PUBLIC_API_URL"
            description={`${origin}/api/${params.storeId}`}
            variant="public"
          />
        </div>
      </div>
    </>
  );
};
