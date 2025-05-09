import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = (await req.json()) as {
      name: string;
      price: number;
      categoryId: string;
      images: { url: string }[];
      isFeatured: boolean;
      isArchived: boolean;
      description: string;
      variants: {
        inStock: number;
        sizeId: string;
        colorId: string;
      }[];
    };

    const {
      name,
      price,
      categoryId,
      images,
      variants,
      isFeatured,
      isArchived,
      description,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", {
        status: 403,
      });
    }

    if (!name) {
      return new NextResponse("Name is required", {
        status: 400,
      });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", {
        status: 400,
      });
    }

    if (!price) {
      return new NextResponse("Price is required", {
        status: 400,
      });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", {
        status: 400,
      });
    }

    if (!description) {
      return new NextResponse("Description is required", {
        status: 400,
      });
    }

    if (!variants || variants.length === 0) {
      return new NextResponse(
        "Need at least 1 variant of a product",
        { status: 400 }
      );
    }

    // Validate that all sizeId and colorId values are valid MongoDB ObjectIDs
    for (const variant of variants) {
      // Check if sizeId or colorId is not a valid MongoDB ObjectID (24 hex characters)
      if (variant.sizeId && typeof variant.sizeId === 'string') {
        if (!/^[0-9a-fA-F]{24}$/.test(variant.sizeId)) {
          try {
            // If it's not a valid ID, look up the actual ID by name
            const size = await prismadb.size.findFirst({
              where: {
                name: variant.sizeId,
                storeId: params.storeId
              }
            });
            
            if (!size) {
              return new NextResponse(`Size with name "${variant.sizeId}" not found`, { status: 400 });
            }
            
            // Replace the name with the actual ID
            variant.sizeId = size.id;
          } catch (error) {
            console.error("Error finding size:", error);
            return new NextResponse(`Invalid size selection`, { status: 400 });
          }
        }
      }
      
      if (variant.colorId && typeof variant.colorId === 'string') {
        if (!/^[0-9a-fA-F]{24}$/.test(variant.colorId)) {
          try {
            // If it's not a valid ID, look up the actual ID by name
            const color = await prismadb.color.findFirst({
              where: {
                name: variant.colorId,
                storeId: params.storeId
              }
            });
            
            if (!color) {
              return new NextResponse(`Color with name "${variant.colorId}" not found`, { status: 400 });
            }
            
            // Replace the name with the actual ID
            variant.colorId = color.id;
          } catch (error) {
            console.error("Error finding color:", error);
            return new NextResponse(`Invalid color selection`, { status: 400 });
          }
        }
      }
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", {
        status: 405,
      });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        storeId: params.storeId,
        description,
        variants: {
          createMany: {
            data: [
              ...variants.map(
                (variant: {
                  inStock: number;
                  sizeId: string;
                  colorId: string;
                }) => variant
              ),
            ],
          },
        },
        images: {
          createMany: {
            data: [
              ...images.map(
                (image: { url: string }) => image
              ),
            ],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}

// CORS headers for public endpoints
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  console.log(`[PRODUCTS_GET] Request for storeId: ${params.storeId}`);
  
  try {
    const { searchParams } = new URL(req.url);
    const categoryId =
      searchParams.get("categoryId") || undefined;
    const name = searchParams.get("name") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const colorId =
      searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;

    // Log request parameters for debugging
    console.log("[PRODUCTS_GET] Search params:", {
      storeId: params.storeId,
      categoryId,
      name,
      isFeatured,
      colorId,
      sizeId
    });

    if (!params.storeId) {
      console.error("[PRODUCTS_GET] Missing storeId parameter");
      return new NextResponse("Store id is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        name: name ? { contains: name } : undefined,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
        variants: {
          some: {
            colorId: colorId,
            sizeId: sizeId,
          },
        },
      },
      include: {
        images: true,
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    console.log(`[PRODUCTS_GET] Found ${products.length} products for store ${params.storeId}`);

    return NextResponse.json(products, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("[PRODUCTS_GET] Error:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
}
