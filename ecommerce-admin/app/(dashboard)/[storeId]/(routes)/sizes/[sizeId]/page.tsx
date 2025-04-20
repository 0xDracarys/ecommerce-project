import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizePage = async ({
  params,
}: {
  params: { sizeId: string };
}) => {
  // Only query the database if sizeId is not "new"
  const size = params.sizeId === "new" 
    ? null 
    : await prismadb.size.findUnique({
        where: {
          id: params.sizeId,
        },
      });

  return (
    <div className="flex-col md:ml-56">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
