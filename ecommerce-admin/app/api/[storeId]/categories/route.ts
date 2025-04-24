import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

// CORS headers for public endpoints
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = (await req.json()) as {
      name: string;
      billboardId: string;
    };

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", {
        status: 401,
      });
    }

    if (!name) {
      return new NextResponse("Name is required", {
        status: 400,
      });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", {
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

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST] Error:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  console.log(`[CATEGORIES_GET] Request for storeId: ${params.storeId}`);

  try {
    if (!params.storeId) {
      console.error("[CATEGORIES_GET] Missing storeId parameter");
      return new NextResponse("Store ID is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        billboard: true,
      },
    });

    console.log(`[CATEGORIES_GET] Found ${categories.length} categories for store ${params.storeId}`);
    
    return NextResponse.json(categories, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("[CATEGORIES_GET] Error:", error);
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
