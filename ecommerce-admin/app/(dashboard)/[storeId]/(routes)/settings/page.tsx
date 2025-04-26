import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Metadata } from "next";

import prismadb from "@/lib/prismadb";
import { SettingsForm } from "./components/settings-form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Settings | Store Dashboard",
  description: "Manage your store settings",
};

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

export default async function SettingsPage({
  params,
}: SettingsPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 transition-colors duration-200">
      <div className="flex-1 py-8 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6 md:p-8 mb-8">
            <div className="flex flex-col space-y-2">
              <Heading
                title="Store Settings"
                description="Manage your store preferences"
                className="py-2"
              />
            </div>
          </div>
          
          <SettingsForm initialData={store} />
        </div>
      </div>
    </div>
  );
}
