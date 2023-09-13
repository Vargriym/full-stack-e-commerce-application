import { NextResponse } from "next/server"
// @ts-ignore
import { validateCartItems } from "use-shopping-cart/utilities"

import { inventory } from "@/config/inventory"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const cartDetails = await request.json()
  validateCartItems(inventory, cartDetails)
  const origin  = request.headers.get('origin')
  const session = await stripe.checkout.sessions.create({
    submit_type: "pay",
    mode: "payment",
    payment_method_types: ['card'],
    shipping_address_collection: {
    allowed_countries: ['US']
    },
    shipping_options: [
    {
    shipping_rate: "shr_1NpxnfB5Gd9yLUsJ8GwsRJ9i"
    }
    ],
    billing_address_collection: "auto",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`

    })
    return NextResponse.json(session)
  }