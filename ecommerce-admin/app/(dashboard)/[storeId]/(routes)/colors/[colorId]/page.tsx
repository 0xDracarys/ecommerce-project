import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";

const ColorPage = async ({
  params,
}: {
  params: { colorId: string };
}) => {
  // Only query the database if colorId is not "new"
  const color = params.colorId === "new" 
    ? null 
    : await prismadb.color.findUnique({
        where: {
          id: params.colorId,
        },
      });

  return (
    <div className="flex-col md:ml-56">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
