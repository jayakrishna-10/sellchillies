# SellChillies - Business Management System

A comprehensive web application for managing chillies trading business and loan operations. Built with Next.js, Supabase, and deployed on Vercel.

## Features

- **Customer Management**: Add, search, and track customer information
- **Loan Management**: Track loans with automatic 2% interest calculation per 30 days
- **Recovery Tracking**: Record and manage loan recoveries
- **Chillies Trading**: Manage chillies transactions with automatic commission and service charge calculations
- **Dashboard Analytics**: Real-time business insights and statistics
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Version Control**: Git/GitHub

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account
- Vercel account (for deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sellchillies-app.git
cd sellchillies-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to SQL Editor and run the schema from `database/schema.sql`

### 4. Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

### Running the Schema

1. Open your Supabase project
2. Go to SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Click "Run" to create all tables and relationships

### Database Structure

- **customers**: Store customer information
- **loans**: Track loan records with interest rates
- **recoveries**: Record loan recovery payments
- **chillies_transactions**: Manage chillies trading transactions

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sellchillies-app)

### Environment Variables for Production

In your Vercel dashboard, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Business Logic

### Loan Interest Calculation
- Interest Rate: 2% every 30 days
- Calculation: `principal + (principal × 0.02 × interest_periods)`
- Interest periods = `Math.floor(days_since_loan / 30)`

### Chillies Transaction Calculations
- **Total Earnings**: `(weight_kg × market_rate) + (number_of_bags × 45)`
- **Commission**: `total_earnings × 0.02` (2%)
- **Service Charge**: `number_of_bags × 29`
- **Net Amount**: `total_earnings - commission - service_charge`

### Customer Balance
- **Balance**: `total_loans_with_interest - total_recoveries`
- Positive balance = Outstanding amount
- Negative balance = Credit balance

## Usage

### Adding Customers
1. Go to Customers tab
2. Fill in customer details (name is required)
3. Click "Add Customer"

### Managing Loans
1. Go to Loans tab
2. Select customer, enter amount and date
3. Interest is automatically calculated based on time elapsed

### Recording Recoveries
1. Go to Recoveries tab
2. Select customer and enter recovery amount
3. Customer balance updates automatically

### Chillies Trading
1. Go to Chillies Trading tab
2. Enter bags, weight, market rate
3. Commission and charges are calculated automatically
4. Net amount shows what customer receives

## Development

### Project Structure

```
sellchillies-app/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   └── CustomersTab.js
├── database/
│   └── schema.sql
├── lib/
│   └── supabase.js
├── public/
├── .env.local.example
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

### Adding New Features

1. Create new components in `components/` directory
2. Add database operations in `lib/supabase.js`
3. Update schema in `database/schema.sql` if needed
4. Test locally before deploying

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure Supabase database is properly configured
4. Check network connectivity

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Vercel for seamless deployment
- Tailwind CSS for the styling system

---

Made with ❤️ for chillies traders everywhere!
