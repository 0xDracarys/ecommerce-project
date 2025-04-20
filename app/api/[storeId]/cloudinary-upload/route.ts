import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!body.file) {
      return new NextResponse("File is required", { status: 400 });
    }

    // Use the utility function to upload the file to Cloudinary
    const uploadResult = await uploadToCloudinary(
      body.file,
      `${params.storeId}/products`
    );

    return NextResponse.json(
      { 
        success: true,
        url: uploadResult.secure_url
      }
    );
  } catch (error) {
    console.log('[CLOUDINARY_UPLOAD_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 