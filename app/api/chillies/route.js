import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('chillies_transactions')
      .select(`
        *,
        customers (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching chillies transactions:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.customer_id || !body.number_of_bags || !body.weight_kg || !body.market_rate || !body.transaction_date) {
      return NextResponse.json({ 
        error: 'All fields are required: customer_id, number_of_bags, weight_kg, market_rate, transaction_date' 
      }, { status: 400 })
    }

    // Validate numeric values
    const bags = parseInt(body.number_of_bags)
    const weight = parseFloat(body.weight_kg)
    const rate = parseFloat(body.market_rate)

    if (bags <= 0 || weight <= 0 || rate <= 0) {
      return NextResponse.json({ 
        error: 'Number of bags, weight, and market rate must be greater than 0' 
      }, { status: 400 })
    }

    // Calculate amounts according to business logic
    const totalEarnings = (weight * rate) + (bags * 45)
    const commission = totalEarnings * 0.02 // 2% commission
    const serviceCharge = bags * 29 // ₹29 per bag
    const totalCharges = commission + serviceCharge
    const netAmount = totalEarnings - totalCharges

    const transactionData = {
      customer_id: body.customer_id,
      number_of_bags: bags,
      weight_kg: weight,
      market_rate: rate,
      total_earnings: totalEarnings,
      commission: commission,
      service_charge: serviceCharge,
      total_charges: totalCharges,
      net_amount: netAmount,
      transaction_date: body.transaction_date
    }

    const { data, error } = await supabase
      .from('chillies_transactions')
      .insert([transactionData])
      .select()

    if (error) {
      console.error('Error creating chillies transaction:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
