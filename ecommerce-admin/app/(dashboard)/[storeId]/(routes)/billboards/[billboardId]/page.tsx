import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  // Only query the database if billboardId is not "new"
  const billboard = params.billboardId === "new" 
    ? null 
    : await prismadb.billboard.findUnique({
        where: {
          id: params.billboardId,
        },
      });

  return (
    <main className="flex-col md:ml-56">
      <section className="flex-1 p-8 pt-6 space-y-4">
        <BillboardForm initialData={billboard} />
      </section>
    </main>
  );
};

export default BillboardPage;
