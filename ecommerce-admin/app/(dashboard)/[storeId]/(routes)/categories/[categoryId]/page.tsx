import prismadb from "@/lib/prismadb";

import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  // Only query the database if categoryId is not "new"
  const category = params.categoryId === "new" 
    ? null 
    : await prismadb.category.findUnique({
        where: {
          id: params.categoryId,
        },
      });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col md:ml-56">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <CategoryForm 
          billboards={billboards} 
          initialData={category} 
        />
      </div>
    </div>
  );
};

export default CategoryPage;
