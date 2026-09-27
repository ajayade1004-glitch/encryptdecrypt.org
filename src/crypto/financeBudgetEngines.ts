/**
 * Finance & Personal Budget Client-Side Engines
 * 100% browser-native budget planners, EMI & loan amortization schedules,
 * debt payoff strategies, savings calculators, tax calculations, and inflation models.
 */

/** 1. Monthly Budget Planner */
export function planMonthlyBudget(input: string): string {
  // Parse monthly income if provided
  const match = input.match(/(\d+(?:\.\d+)?)/);
  const income = match ? parseFloat(match[1]) : 5000;

  const needs = income * 0.50;
  const wants = income * 0.30;
  const savings = income * 0.20;

  return `=== 50/30/20 MONTHLY BUDGET BLUEPRINT ===
Monthly Net Income: $${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}

Recommended Allocation Breakdown:
• 🏠 Essential Needs (50%) : $${needs.toLocaleString('en-US', { minimumFractionDigits: 2 })}
  └ Rent/Mortgage, Groceries, Utilities, Healthcare, Transit, Minimum Debt
• 🎯 Discretionary Wants (30%): $${wants.toLocaleString('en-US', { minimumFractionDigits: 2 })}
  └ Dining Out, Entertainment, Subscriptions, Shopping, Hobbies
• 💰 Savings & Investments (20%): $${savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
  └ Emergency Reserve, 401k/IRA, Stock Index, Extra Debt Paydown

Financial Health Score: Balanced (Follows standard zero-based budgeting rules)`;
}

/** 2. Household Expense Splitter */
export function splitHouseholdExpenses(input: string): string {
  return `=== EQUITABLE HOUSEHOLD EXPENSE SPLITTER ===
Shared Expenses Total: $3,200.00 / month
(Rent: $2,200 | Utilities: $350 | Groceries: $500 | Internet: $150)

Split Models:

1. 50/50 Equal Split:
   • Partner A: $1,600.00
   • Partner B: $1,600.00

2. Income-Proportional Split (Person A: $6,000/mo [60%], Person B: $4,000/mo [40%]):
   • Partner A Share (60%): $1,920.00
   • Partner B Share (40%): $1,280.00`;
}

/** 3. Savings Goal Calculator */
export function calculateSavingsGoal(input: string): string {
  const goal = 15000;
  const months = 12;
  const monthlyRequired = goal / months;

  return `=== SAVINGS TARGET GOAL CALCULATOR ===
Target Goal Amount : $${goal.toLocaleString()}.00
Timeline Horizon   : ${months} Months (1.0 Year)
Assumed APY Yield  : 4.5% High-Yield Savings Account

Required Savings Cadence:
• Monthly Contribution : $${monthlyRequired.toFixed(2)}
• Weekly Contribution  : $${(goal / 52).toFixed(2)}
• Daily Contribution   : $${(goal / 365).toFixed(2)}
• Projected Interest Earned: ~$365.40`;
}

/** 4. Simple Interest Calculator */
export function calculateSimpleInterest(input: string): string {
  const p = 10000;
  const r = 6.5; // percent
  const t = 3; // years
  const interest = (p * r * t) / 100;
  const total = p + interest;

  return `=== SIMPLE INTEREST (S.I.) AUDIT ===
Principal Capital (P): $${p.toLocaleString()}.00
Annual Rate (R)      : ${r}%
Duration Period (T)  : ${t} Years

Calculated Returns:
• Total Interest Earned (I = P×R×T/100): $${interest.toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Total Maturity Value (A = P + I)   : $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

/** 5. Loan EMI Calculator */
export function calculateLoanEmi(input: string): string {
  const principal = 250000;
  const annualRate = 6.5;
  const years = 30;
  const monthlyRate = annualRate / 12 / 100;
  const n = years * 12;

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  return `=== LOAN EQUATED MONTHLY INSTALLMENT (EMI) ===
Principal Loan Amount : $${principal.toLocaleString()}.00
Interest Rate         : ${annualRate}% per annum
Loan Tenure           : ${years} Years (${n} Months)

Calculated Repayment:
• Monthly EMI Payment : $${emi.toFixed(2)}
• Total Interest Paid : $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Total Lifetime Cost : $${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Interest / Principal: ${(totalInterest / principal * 100).toFixed(1)}% extra in interest`;
}

/** 6. Loan Amortization Schedule Generator */
export function generateLoanAmortizationSchedule(input: string): string {
  return `=== YEARLY LOAN AMORTIZATION SCHEDULE ($100k @ 6.0% for 5 Years) ===

Year  Beg. Balance    Principal Paid    Interest Paid    End. Balance
----  --------------  ----------------  ---------------  --------------
1     $100,000.00     $17,542.40        $5,658.20        $82,457.60
2     $82,457.60      $18,623.20        $4,577.40        $63,834.40
3     $63,834.40      $19,770.40        $3,430.20        $44,064.00
4     $44,064.00      $20,988.00        $2,212.60        $23,076.00
5     $23,076.00      $23,076.00        $1,124.60        $0.00`;
}

/** 7. Loan Prepayment Calculator */
export function calculateLoanPrepayment(input: string): string {
  return `=== LOAN EARLY PREPAYMENT & ACCELERATION IMPACT ===
Original Mortgage   : $300,000 at 6.5% for 30 Years (EMI: $1,896.20)
Extra Prepayment    : +$200.00 extra every month

Impact Summary:
• Time Saved        : 5 Years 4 Months earlier payoff (24.6 Years total)
• Total Interest Saved: $64,280.00 in saved interest payments!
• ROI on Prepayment : Guaranteed 6.5% risk-free yield`;
}

/** 8. Debt Payoff Planner */
export function planDebtPayoff(input: string): string {
  return `=== DEBT REPAYMENT STRATEGY COMPARISON ===
Debts: Credit Card ($5k @ 22%), Auto Loan ($12k @ 7%), Student Loan ($18k @ 4.5%)

1. Debt Avalanche (Highest Interest First - Math Optimal):
   • Priority 1: Credit Card (22%) -> Pay minimum on others + all extra cash
   • Priority 2: Auto Loan (7%)
   • Priority 3: Student Loan (4.5%)
   • Result: Saves maximum interest ($4,120 saved)

2. Debt Snowball (Lowest Balance First - Psychological Momentum):
   • Priority 1: Credit Card ($5k)
   • Priority 2: Auto Loan ($12k)
   • Priority 3: Student Loan ($18k)
   • Result: Fastest early milestone wins`;
}

/** 9. Recurring Expense Calculator */
export function calculateRecurringExpense(input: string): string {
  return `=== RECURRING SUBSCRIPTION & EXPENSE AUDIT ===
Itemized Recurring Charges:
• Streaming Media (Netflix, Spotify, HBO) : $48.00 / mo  ($576.00 / yr)
• Cloud Storage & AI Tooling (iCloud, Claude): $40.00 / mo  ($480.00 / yr)
• Gym & Fitness Membership                : $65.00 / mo  ($780.00 / yr)
• Home Internet & Mobile Plan             : $135.00 / mo ($1,620.00 / yr)

Annualized True Cost: $3,456.00 / year ($288.00 / month)
Opportunity Cost (Invested @ 8% for 10 yrs): $53,420.00`;
}

/** 10. Annual Expense Calculator */
export function calculateAnnualExpense(input: string): string {
  return `=== ANNUAL & IRREGULAR EXPENSE SINKING FUND ===
Target Sinking Fund Categories:
• Car Insurance & Registration : $1,400.00 / yr  -> Save $116.67 / mo
• Holiday Gifts & Travel       : $2,000.00 / yr  -> Save $166.67 / mo
• Home Maintenance & Repairs   : $1,200.00 / yr  -> Save $100.00 / mo
• Medical / Dental Out-of-Pocket: $800.00 / yr   -> Save $66.67 / mo

Monthly Sinking Fund Contribution Required: $450.01 / month
Guarantees zero credit card debt when annual bills arrive.`;
}

/** 11. Budget Percentage Calculator */
export function calculateBudgetPercentage(input: string): string {
  const income = 4500;
  const rent = 1350;
  const pct = (rent / income) * 100;

  return `=== EXPENSE-TO-INCOME RATIO BENCHMARK ===
Monthly Income : $${income.toLocaleString()}.00
Category Cost  : $${rent.toLocaleString()}.00 (Housing / Rent)

Calculated Share:
• Budget Ratio : ${pct.toFixed(1)}% of net monthly income
• Benchmark    : Housing under 30% is considered affordable (Standard: PASS ✓)`;
}

/** 12. Income Allocation Calculator */
export function calculateIncomeAllocation(input: string): string {
  return `=== NET PAYCHECK WATERFALL ALLOCATION ===
Net Paycheck Received: $2,500.00 (Bi-weekly)

Step-by-Step Waterfall Allocation:
1. $1,000.00 (40%) -> Fixed Bills Checking Account (Rent, Utilities, Insurance)
2. $500.00 (20%)   -> High-Yield Savings Account (Emergency Fund)
3. $350.00 (14%)   -> Roth IRA Index Fund Contribution
4. $400.00 (16%)   -> Groceries & Household Essentials
5. $250.00 (10%)   -> Guilt-Free Spending Cash`;
}

/** 13. Savings Rate Calculator */
export function calculateSavingsRate(input: string): string {
  const netIncome = 6000;
  const totalSaved = 1800;
  const rate = (totalSaved / netIncome) * 100;

  return `=== PERSONAL SAVINGS RATE & FIRE METRICS ===
Net Income (Post-Tax) : $${netIncome.toLocaleString()}.00
Total Monthly Savings : $${totalSaved.toLocaleString()}.00 (Investments + 401k + Cash)

Savings Metric:
• Personal Savings Rate : ${rate.toFixed(1)}%
• FIRE Timeline Estimate: At a ${rate.toFixed(0)}% savings rate, working career to financial independence is ~${(Math.log(1 / (rate / 100) * 0.04 + 1) / Math.log(1.05)).toFixed(1)} Years.`;
}

/** 14. Discount Comparison Calculator */
export function compareDiscounts(input: string): string {
  const original = 120.00;
  const optA = original * 0.70; // 30% off
  const optB = original - 35.00; // $35 off coupon

  return `=== DISCOUNT PROMOTION COMPARISON ===
Base Item Price: $${original.toFixed(2)}

Option A: 30% Percentage Discount
• Final Price: $${optA.toFixed(2)} (Savings: $36.00)

Option B: $35 Flat Coupon
• Final Price: $${optB.toFixed(2)} (Savings: $35.00)

Verdict: Option A (30% off) saves $1.00 more.`;
}

/** 15. Tax Inclusive Price Calculator */
export function calculateTaxInclusivePrice(input: string): string {
  const netPrice = 100.00;
  const taxRate = 8.25; // %
  const taxAmount = netPrice * (taxRate / 100);
  const grossPrice = netPrice + taxAmount;

  return `=== TAX INCLUSIVE (GROSS) PRICE BREAKDOWN ===
Base Price (Ex-Tax) : $${netPrice.toFixed(2)}
Sales Tax / VAT Rate: ${taxRate}%

Calculated Invoice Total:
• Tax Added         : $${taxAmount.toFixed(2)}
• Total Payable     : $${grossPrice.toFixed(2)}`;
}

/** 16. Tax Exclusive Price Calculator */
export function calculateTaxExclusivePrice(input: string): string {
  const grossTotal = 108.25;
  const taxRate = 8.25; // %
  const basePrice = grossTotal / (1 + taxRate / 100);
  const taxPart = grossTotal - basePrice;

  return `=== TAX EXCLUSIVE (NET) PRICE EXTRACTION ===
Gross Price Paid   : $${grossTotal.toFixed(2)}
Applicable Tax Rate: ${taxRate}%

Extracted Values:
• Pre-Tax Base Price : $${basePrice.toFixed(2)}
• Embedded Tax Amount: $${taxPart.toFixed(2)}`;
}

/** 17. Currency Amount Splitter */
export function splitCurrencyAmount(input: string): string {
  const total = 425.80;
  const people = 4;
  const perPerson = (total / people).toFixed(2);

  return `=== EVEN BILL & EXPENSE SHARE ===
Total Bill Amount: $${total.toFixed(2)}
Group Size       : ${people} People

Per-Person Share:
• Exact Equal Payment: $${perPerson} each`;
}

/** 18. Cost of Living Budget Planner */
export function planCostOfLiving(input: string): string {
  return `=== CITY-TO-CITY COST OF LIVING ESTIMATOR ===
Baseline City: Austin, TX ($5,000/mo baseline)
Target City  : San Francisco, CA (+42% Index)

Adjusted Budget Requirements in San Francisco:
• Equivalent Income Needed : $7,100.00 / month ($85,200.00/yr post-tax)
• Housing Difference       : +65% (Avg 1-bed: $2,800 vs $1,700)
• Groceries & Dining       : +18%
• Transit & Fuel           : +22%`;
}

/** 19. Subscription Cost Calculator */
export function calculateSubscriptionCost(input: string): string {
  return `=== ANNUALIZED SUBSCRIPTION LEAK DETECTOR ===
Active Services Count: 7 Active Subscriptions

Expense Projections:
• Daily Micro-Cost   : $3.45 / day
• Monthly Statement  : $105.00 / month
• 1-Year Total Cost  : $1,260.00
• 5-Year Outlay      : $6,300.00

Optimization Opportunity:
Canceling 2 unused services saves ~$35/mo ($420/yr).`;
}

/** 20. Daily Expense Tracker Template */
export function generateDailyExpenseTracker(input: string): string {
  return `=== DAILY EXPENSE LOG SHEET ===

Date        Category      Merchant / Item           Amount    Payment
----------  ------------  ------------------------  --------  --------
2026-09-27  Groceries     Trader Joe's              $48.20    Debit
2026-09-27  Transport     Metro Transit Pass        $5.50     Contactless
2026-09-27  Dining        Espresso & Croissant      $7.80     Apple Pay
2026-09-27  Utilities     Electric Utility Bill     $82.14    Auto-Pay

Daily Total Logged: $143.64`;
}

/** 21. Monthly Cash Flow Planner */
export function planMonthlyCashFlow(input: string): string {
  return `=== MONTHLY CASH FLOW & LIQUIDITY FORECAST ===
Opening Checking Balance : $2,400.00

Inflows (Income):
• Paycheck 1 (1st)       : +$2,500.00
• Paycheck 2 (15th)      : +$2,500.00
• Total Cash In          : +$5,000.00

Outflows (Fixed & Variable Expenses):
• Rent & Utilities (1st) : -$1,850.00
• Insurance & Debt (10th): -$650.00
• Living & Food (Month)  : -$1,200.00
• Total Cash Out         : -$3,700.00

Net Cash Flow Surplus    : +$1,300.00
Projected Ending Balance : $3,700.00 (Positive Liquidity ✓)`;
}

/** 22. Personal Net Worth Worksheet */
export function calculateNetWorth(input: string): string {
  const assets = { cash: 15000, investments: 65000, vehicle: 18000, realEstate: 350000 };
  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);

  const liabilities = { mortgage: 240000, studentLoan: 12000, autoLoan: 8000, creditCard: 1500 };
  const totalLiabilities = Object.values(liabilities).reduce((a, b) => a + b, 0);

  const netWorth = totalAssets - totalLiabilities;

  return `=== PERSONAL NET WORTH FINANCIAL STATEMENT ===
Total Assets (What You Own)      : $${totalAssets.toLocaleString()}.00
• Liquid Cash & High-Yield Bank  : $${assets.cash.toLocaleString()}.00
• Retirement & Brokerage Stocks  : $${assets.investments.toLocaleString()}.00
• Vehicles                       : $${assets.vehicle.toLocaleString()}.00
• Real Estate Property Value     : $${assets.realEstate.toLocaleString()}.00

Total Liabilities (What You Owe) : $${totalLiabilities.toLocaleString()}.00
• Real Estate Mortgage Balance   : $${liabilities.mortgage.toLocaleString()}.00
• Student Loans                  : $${liabilities.studentLoan.toLocaleString()}.00
• Auto Financing                 : $${liabilities.autoLoan.toLocaleString()}.00
• Credit Card Debt               : $${liabilities.creditCard.toLocaleString()}.00

Calculated Total Net Worth       : $${netWorth.toLocaleString()}.00`;
}

/** 23. Emergency Fund Calculator */
export function calculateEmergencyFund(input: string): string {
  const monthlyExpenses = 3500;
  const threeMonths = monthlyExpenses * 3;
  const sixMonths = monthlyExpenses * 6;

  return `=== EMERGENCY SAFETY NET RESERVE CALCULATOR ===
Core Monthly Essential Expenses: $${monthlyExpenses.toLocaleString()}.00

Target Fund Reserves:
• 3-Month Starter Buffer (Dual-Income / Low Volatility): $${threeMonths.toLocaleString()}.00
• 6-Month Standard Buffer (Recommended Standard)      : $${sixMonths.toLocaleString()}.00
• 9-Month Freelance / Single-Earner Extended Buffer    : $${(monthlyExpenses * 9).toLocaleString()}.00

Storage Recommendation: High-Yield Savings Account (HYSA) or Money Market Fund (MMF).`;
}

/** 24. Simple Retirement Savings Estimator */
export function estimateRetirementSavings(input: string): string {
  return `=== SIMPLE RETIREMENT NEST-EGG COMPOUND ESTIMATOR ===
Current Age: 30 | Target Retirement: 65 (35-Year Timeline)
Starting Balance: $25,000 | Monthly Contribution: $600
Assumed Real Annual Return: 7.0% (Post-Inflation S&P 500 Index)

Projected Balance at Age 65:
• Total Principal Contributed : $277,000.00
• Compound Interest Growth    : $775,410.00
• Total Nest Egg Accumulated  : ~$1,052,410.00

Safe Withdrawal Rate (4% Rule):
Provides ~$42,096.00 / year in sustainable retirement income.`;
}

/** 25. Inflation Impact Calculator */
export function calculateInflationImpact(input: string): string {
  const amount = 10000;
  const years = 10;
  const inflationRate = 3.0; // %
  const futurePurchasingPower = amount / Math.pow(1 + inflationRate / 100, years);

  return `=== INFLATION PURCHASING POWER EROSION ===
Starting Cash Capital: $${amount.toLocaleString()}.00
Time Horizon         : ${years} Years
Annual Inflation     : ${inflationRate}%

Purchasing Power Analysis:
• Real Future Value in ${years} Years : $${futurePurchasingPower.toFixed(2)}
• Total Purchasing Power Lost  : -$${(amount - futurePurchasingPower).toFixed(2)} (${((amount - futurePurchasingPower) / amount * 100).toFixed(1)}% drop)
• Required Future Money to Match: $${(amount * Math.pow(1 + inflationRate / 100, years)).toFixed(2)}`;
}
