import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select(`
        *,
        customers (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching loans:', error)
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
    if (!body.customer_id || !body.amount || !body.loan_date) {
      return NextResponse.json({ 
        error: 'Customer ID, amount, and loan date are required' 
      }, { status: 400 })
    }

    // Validate amount is positive
    if (parseFloat(body.amount) <= 0) {
      return NextResponse.json({ 
        error: 'Loan amount must be greater than 0' 
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('loans')
      .insert([{
        customer_id: body.customer_id,
        amount: parseFloat(body.amount),
        interest_rate: parseFloat(body.interest_rate) || 2.0,
        loan_date: body.loan_date
      }])
      .select()

    if (error) {
      console.error('Error creating loan:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
