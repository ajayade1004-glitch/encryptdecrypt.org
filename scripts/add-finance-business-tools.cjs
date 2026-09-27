const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const financeTools = [
  { name: 'Monthly Budget Planner', slug: 'monthly-budget-planner', shortDesc: 'Plan zero-based monthly budgets using the proven 50/30/20 needs, wants, and savings rule.' },
  { name: 'Household Expense Splitter', slug: 'household-expense-splitter', shortDesc: 'Split shared household bills equally or proportionally according to income.' },
  { name: 'Savings Goal Calculator', slug: 'savings-goal-calculator', shortDesc: 'Calculate monthly, weekly, and daily savings required to hit target financial goals.' },
  { name: 'Simple Interest Calculator', slug: 'simple-interest-calculator', shortDesc: 'Calculate simple interest yield, principal growth, and final maturity values.' },
  { name: 'Loan EMI Calculator', slug: 'loan-emi-calculator', shortDesc: 'Calculate equated monthly installments (EMI) and total lifetime interest costs.' },
  { name: 'Loan Amortization Schedule Generator', slug: 'loan-amortization-schedule-generator', shortDesc: 'Generate yearly amortization schedules showing principal vs interest breakdown.' },
  { name: 'Loan Prepayment Calculator', slug: 'loan-prepayment-calculator', shortDesc: 'Calculate tenure reduction and interest saved by making extra monthly loan prepayments.' },
  { name: 'Debt Payoff Planner', slug: 'debt-payoff-planner', shortDesc: 'Compare Debt Avalanche (highest interest) vs Debt Snowball (lowest balance) strategies.' },
  { name: 'Recurring Expense Calculator', slug: 'recurring-expense-calculator', shortDesc: 'Audit recurring monthly subscriptions and calculate 10-year investment opportunity costs.' },
  { name: 'Annual Expense Calculator', slug: 'annual-expense-calculator', shortDesc: 'Calculate monthly sinking fund contributions for irregular annual bills and insurance.' },
  { name: 'Budget Percentage Calculator', slug: 'budget-percentage-calculator', shortDesc: 'Calculate expense-to-income percentages and housing affordability benchmarks.' },
  { name: 'Income Allocation Calculator', slug: 'income-allocation-calculator', shortDesc: 'Create paycheck waterfall allocations across bills, savings, investing, and spending.' },
  { name: 'Savings Rate Calculator', slug: 'savings-rate-calculator', shortDesc: 'Calculate personal net savings rate and estimate years to financial independence (FIRE).' },
  { name: 'Discount Comparison Calculator', slug: 'discount-comparison-calculator', shortDesc: 'Compare percentage discounts vs fixed dollar coupons to find maximum savings.' },
  { name: 'Tax Inclusive Price Calculator', slug: 'tax-inclusive-price-calculator', shortDesc: 'Calculate gross invoice totals by adding sales tax or VAT to net prices.' },
  { name: 'Tax Exclusive Price Calculator', slug: 'tax-exclusive-price-calculator', shortDesc: 'Extract pre-tax base prices and embedded tax amounts from gross receipts.' },
  { name: 'Currency Amount Splitter', slug: 'currency-amount-splitter', shortDesc: 'Split group restaurant and trip bills evenly down to the exact cent.' },
  { name: 'Cost of Living Budget Planner', slug: 'cost-of-living-budget-planner', shortDesc: 'Compare cost of living differences between cities and calculate required salary.' },
  { name: 'Subscription Cost Calculator', slug: 'subscription-cost-calculator', shortDesc: 'Calculate daily, monthly, 1-year, and 5-year cumulative costs of digital subscriptions.' },
  { name: 'Daily Expense Tracker Template', slug: 'daily-expense-tracker-template', shortDesc: 'Track daily cash and card purchases with category and merchant logs.' },
  { name: 'Monthly Cash Flow Planner', slug: 'monthly-cash-flow-planner', shortDesc: 'Forecast opening balance, income inflows, fixed outflows, and closing liquidity.' },
  { name: 'Personal Net Worth Worksheet', slug: 'personal-net-worth-worksheet', shortDesc: 'Calculate total net worth by balancing liquid/fixed assets against liabilities.' },
  { name: 'Emergency Fund Calculator', slug: 'emergency-fund-calculator', shortDesc: 'Calculate 3-month, 6-month, and 9-month emergency cash safety reserves.' },
  { name: 'Simple Retirement Savings Estimator', slug: 'simple-retirement-savings-estimator', shortDesc: 'Estimate 30-year compound interest nest eggs and safe 4% retirement withdrawals.' },
  { name: 'Inflation Impact Calculator', slug: 'inflation-impact-calculator', shortDesc: 'Calculate purchasing power erosion and future money needed to beat inflation.' }
];

const businessTools = [
  { name: 'Purchase Order Generator', slug: 'purchase-order-generator', shortDesc: 'Generate professional commercial purchase orders (PO) with itemized line totals.' },
  { name: 'Quotation Generator', slug: 'quotation-generator', shortDesc: 'Create formal sales quotations with deliverables, milestones, and payment terms.' },
  { name: 'Delivery Note Generator', slug: 'delivery-note-generator', shortDesc: 'Generate dispatch delivery notes and packing slips with tracking numbers.' },
  { name: 'Payment Receipt Generator', slug: 'payment-receipt-generator', shortDesc: 'Generate payment receipts with transaction references and tax breakdowns.' },
  { name: 'Business Expense Report Template', slug: 'business-expense-report-template', shortDesc: 'Create employee business expense claims with travel, meals, and receipts.' },
  { name: 'Inventory Stock Sheet Generator', slug: 'inventory-stock-sheet-generator', shortDesc: 'Track warehouse inventory levels, reorder points, unit costs, and shelf locations.' },
  { name: 'Stock Reconciliation Worksheet', slug: 'stock-reconciliation-worksheet', shortDesc: 'Reconcile system inventory counts against physical stock audits to find shrinkage.' },
  { name: 'Purchase Register Template', slug: 'purchase-register-template', shortDesc: 'Record monthly B2B vendor bills, tax credits, and gross purchase totals.' },
  { name: 'Sales Register Template', slug: 'sales-register-template', shortDesc: 'Maintain records of outbound customer invoices, payment methods, and net revenue.' },
  { name: 'Customer Ledger Template', slug: 'customer-ledger-template', shortDesc: 'Track customer accounts receivable, invoice debits, payment credits, and due balances.' },
  { name: 'Vendor Ledger Template', slug: 'vendor-ledger-template', shortDesc: 'Track accounts payable balances, vendor bills, and ACH payment settlements.' },
  { name: 'Daily Cash Book Template', slug: 'daily-cash-book-template', shortDesc: 'Generate two-column cash and bank ledger sheets for daily business receipts.' },
  { name: 'Petty Cash Calculator', slug: 'petty-cash-calculator', shortDesc: 'Manage petty cash imprest floats, log office vouchers, and calculate reimbursement.' },
  { name: 'Product Pricing Worksheet', slug: 'product-pricing-worksheet', shortDesc: 'Calculate retail prices (MSRP) and gross margins using cost-plus markup formulas.' },
  { name: 'Business Name Brainstorming Tool', slug: 'business-name-brainstorming-tool', shortDesc: 'Generate brand names, tech prefixes, and domain concepts from core keywords.' },
  { name: 'SKU Generator', slug: 'sku-generator', shortDesc: 'Generate standardized Stock Keeping Unit (SKU) codes for e-commerce products.' },
  { name: 'Product Code Generator', slug: 'product-code-generator', shortDesc: 'Generate unique internal product identification numbers and barcode references.' },
  { name: 'Inventory Turnover Calculator', slug: 'inventory-turnover-calculator', shortDesc: 'Calculate inventory turnover ratios and Days Sales of Inventory (DSI).' },
  { name: 'Sales Target Calculator', slug: 'sales-target-calculator', shortDesc: 'Calculate team and per-representative monthly sales quotas from annual revenue targets.' },
  { name: 'Profit and Loss Worksheet', slug: 'profit-and-loss-worksheet', shortDesc: 'Generate income statements (P&L) showing gross margin, OPEX, and net operating income.' }
];

function upsert(tool, category, categoryName) {
  const existingIdx = tools.findIndex(t => t.slug === tool.slug);
  const toolEntry = {
    id: tool.slug,
    name: tool.name,
    slug: tool.slug,
    category: category,
    categoryName: categoryName,
    shortDesc: tool.shortDesc,
    metaTitle: `${tool.name} - Free Online Tool`,
    metaDescription: `${tool.shortDesc} Fast, 100% client-side, zero server logging.`,
    primaryKeyword: tool.name.toLowerCase(),
    secondaryKeywords: [
      `${tool.name.toLowerCase()} online`,
      `free ${tool.name.toLowerCase()}`,
      `${categoryName.toLowerCase()} tool`
    ],
    lsiKeywords: ['developer tools', 'client-side', 'privacy focused', 'instant calculation'],
    inputType: 'text',
    hasFileSupport: false,
    related: [],
    popular: false
  };

  if (existingIdx >= 0) {
    tools[existingIdx] = { ...tools[existingIdx], ...toolEntry };
  } else {
    tools.push(toolEntry);
  }
}

financeTools.forEach(t => upsert(t, 'finance-budget-tools', 'Finance & Personal Budget Tools'));
businessTools.forEach(t => upsert(t, 'business-operations-tools', 'Business Operations Tools'));

// Link related tools
tools.forEach(t => {
  if (t.category === 'finance-budget-tools') {
    t.related = financeTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  } else if (t.category === 'business-operations-tools') {
    t.related = businessTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully populated 45 tools across 2 categories. Total tools now: ${tools.length}`);
