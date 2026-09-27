// Advanced Client-Side Business & Office Calculators Engine
// 100% Zero-Knowledge Browser Processing

// 1. Invoice Total Calculator
export function calculateInvoiceTotal(params: {
  subtotal: number;
  discountPct?: number;
  taxPct?: number;
  shipping?: number;
}): string {
  const sub = params.subtotal || 1000;
  const discPct = params.discountPct || 0;
  const taxPct = params.taxPct || 0;
  const ship = params.shipping || 0;

  const discountAmount = sub * (discPct / 100);
  const discountedSub = sub - discountAmount;
  const taxAmount = discountedSub * (taxPct / 100);
  const total = discountedSub + taxAmount + ship;

  return [
    `════════════════════════════════════════════════════════════════`,
    `                   INVOICE TOTAL SUMMARY                        `,
    `════════════════════════════════════════════════════════════════`,
    `BASE SUBTOTAL:      $${sub.toFixed(2)}`,
    `DISCOUNT (${discPct}%):   -$${discountAmount.toFixed(2)}`,
    `TAXABLE SUBTOTAL:   $${discountedSub.toFixed(2)}`,
    `TAX (${taxPct}%):           +$${taxAmount.toFixed(2)}`,
    `SHIPPING / FREIGHT: +$${ship.toFixed(2)}`,
    `────────────────────────────────────────────────────────────────`,
    `TOTAL PAYABLE:      $${total.toFixed(2)}`
  ].join('\n');
}

// 2. Invoice Discount Calculator
export function calculateInvoiceDiscount(grossAmount: number, discountRate: number, isFixed: boolean = false): string {
  const disc = isFixed ? discountRate : grossAmount * (discountRate / 100);
  const net = Math.max(0, grossAmount - disc);
  const effectivePct = grossAmount > 0 ? (disc / grossAmount) * 100 : 0;

  return [
    `GROSS INVOICE:    $${grossAmount.toFixed(2)}`,
    `DISCOUNT APPLIED: -$${disc.toFixed(2)} (${effectivePct.toFixed(2)}% effective)`,
    `NET AMOUNT DUE:   $${net.toFixed(2)}`,
    `SAVINGS REALIZED: $${disc.toFixed(2)}`
  ].join('\n');
}

// 3. Invoice Tax Calculator
export function calculateInvoiceTax(amount: number, taxRate: number, isCompound: boolean = false): string {
  const tax = amount * (taxRate / 100);
  const total = amount + tax;

  return [
    `PRE-TAX AMOUNT:   $${amount.toFixed(2)}`,
    `TAX RATE:         ${taxRate}%`,
    `TOTAL TAX AMOUNT: $${tax.toFixed(2)}`,
    `FINAL TOTAL:      $${total.toFixed(2)}`
  ].join('\n');
}

// 4. GST Inclusive Price Calculator
export function calculateGstInclusive(inclusiveTotal: number, gstRate: number = 18): string {
  // Inclusive Formula: Base = Total / (1 + (Rate / 100))
  const base = inclusiveTotal / (1 + gstRate / 100);
  const gstAmount = inclusiveTotal - base;
  const halfGst = gstAmount / 2;

  return [
    `════════════════════════════════════════════════════════════════`,
    `            GST INCLUSIVE PRICE BREAKDOWN (SLAB: ${gstRate}%)            `,
    `════════════════════════════════════════════════════════════════`,
    `TOTAL INCLUSIVE PRICE: ₹${inclusiveTotal.toFixed(2)}`,
    `ORIGINAL BASE VALUE:   ₹${base.toFixed(2)}`,
    `TOTAL GST PORTION:     ₹${gstAmount.toFixed(2)}`,
    ``,
    `SPLIT BREAKDOWN:`,
    `  • CGST (${gstRate / 2}%):           ₹${halfGst.toFixed(2)}`,
    `  • SGST/UTGST (${gstRate / 2}%):     ₹${halfGst.toFixed(2)}`,
    `  • (Or Inter-state IGST ${gstRate}%: ₹${gstAmount.toFixed(2)})`
  ].join('\n');
}

// 5. GST Exclusive Price Calculator
export function calculateGstExclusive(basePrice: number, gstRate: number = 18): string {
  const gstAmount = basePrice * (gstRate / 100);
  const total = basePrice + gstAmount;

  return [
    `BASE NET PRICE:    ₹${basePrice.toFixed(2)}`,
    `GST (${gstRate}%):          +₹${gstAmount.toFixed(2)}`,
    `FINAL GROSS TOTAL: ₹${total.toFixed(2)}`
  ].join('\n');
}

// 6. GST Reverse Calculator
export function calculateGstReverse(finalPaid: number, gstRate: number = 18): string {
  return calculateGstInclusive(finalPaid, gstRate);
}

// 7. GST Split Calculator
export function calculateGstSplit(taxableAmount: number, gstRate: number = 18, isInterState: boolean = false): string {
  const totalGst = taxableAmount * (gstRate / 100);
  if (isInterState) {
    return [
      `INTER-STATE TRANSACTION (IGST):`,
      `Taxable Value: ₹${taxableAmount.toFixed(2)}`,
      `IGST (${gstRate}%):     ₹${totalGst.toFixed(2)}`,
      `Invoice Total: ₹${(taxableAmount + totalGst).toFixed(2)}`
    ].join('\n');
  } else {
    const half = totalGst / 2;
    return [
      `INTRA-STATE TRANSACTION (CGST + SGST):`,
      `Taxable Value: ₹${taxableAmount.toFixed(2)}`,
      `CGST (${gstRate / 2}%):       ₹${half.toFixed(2)}`,
      `SGST (${gstRate / 2}%):       ₹${half.toFixed(2)}`,
      `Total GST:     ₹${totalGst.toFixed(2)}`,
      `Invoice Total: ₹${(taxableAmount + totalGst).toFixed(2)}`
    ].join('\n');
  }
}

// 8. GST Late Fee Estimator
export function estimateGstLateFee(delayDays: number, isNilReturn: boolean = false): string {
  const dailyFee = isNilReturn ? 20 : 50; // ₹20/day for nil, ₹50/day standard
  const totalFee = Math.min(10000, delayDays * dailyFee); // Max cap ₹10,000 per act
  const cgst = totalFee / 2;
  const sgst = totalFee / 2;

  return [
    `════════════════════════════════════════════════════════════════`,
    `                 GST LATE FEE ESTIMATION REPORT                 `,
    `════════════════════════════════════════════════════════════════`,
    `RETURN TYPE:     ${isNilReturn ? 'NIL Tax Liability Return' : 'Standard Regular Return'}`,
    `DELAY IN FILING: ${delayDays} Days`,
    `DAILY RATE:      ₹${dailyFee} / day (₹${dailyFee / 2} CGST + ₹${dailyFee / 2} SGST)`,
    `TOTAL LATE FEE:  ₹${totalFee.toFixed(2)} (CGST ₹${cgst.toFixed(2)} + SGST ₹${sgst.toFixed(2)})`,
    ``,
    `INTEREST NOTICE:`,
    `  Under Section 50(1), interest @ 18% p.a. applies on unpaid net tax liability calculated from the day following the due date.`
  ].join('\n');
}

// 9. GST Invoice Amount Calculator
export function calculateGstInvoice(items: { name: string; qty: number; rate: number; gstRate: number }[]): string {
  let subtotal = 0;
  let totalGst = 0;

  const lines = items.map(it => {
    const lineBase = it.qty * it.rate;
    const lineGst = lineBase * (it.gstRate / 100);
    const lineTotal = lineBase + lineGst;
    subtotal += lineBase;
    totalGst += lineGst;
    return `  • ${it.name}: ${it.qty} x ₹${it.rate.toFixed(2)} = ₹${lineBase.toFixed(2)} (+${it.gstRate}% GST: ₹${lineGst.toFixed(2)})`;
  });

  return [
    `════════════════════════════════════════════════════════════════`,
    `                 GST INVOICE ITEMIZED CALCULATION               `,
    `════════════════════════════════════════════════════════════════`,
    `LINE ITEMS:`,
    ...lines,
    `────────────────────────────────────────────────────────────────`,
    `TOTAL TAXABLE VALUE: ₹${subtotal.toFixed(2)}`,
    `TOTAL GST COMPONENT: ₹${totalGst.toFixed(2)}`,
    `GRAND TOTAL DUE:     ₹${(subtotal + totalGst).toFixed(2)}`
  ].join('\n');
}

// 10. HSN/SAC Code Format Checker
export function checkHsnSacFormat(code: string): string {
  const clean = code.trim().replace(/\s+/g, '');
  const isSac = clean.startsWith('99');
  const len = clean.length;

  let isValid = false;
  let desc = '';

  if (isSac && len === 6) {
    isValid = true;
    desc = 'Valid SAC (Services Accounting Code). Used for invoicing service provisions.';
  } else if (!isSac && [2, 4, 6, 8].includes(len) && /^\d+$/.test(clean)) {
    isValid = true;
    if (len === 2) desc = 'Valid 2-digit Chapter level HSN code (Turnover < ₹1.5 Cr).';
    else if (len === 4) desc = 'Valid 4-digit Heading level HSN code (Turnover ₹1.5 Cr - ₹5 Cr).';
    else if (len === 6) desc = 'Valid 6-digit Subheading level HSN code (Mandatory for >₹5 Cr B2B).';
    else desc = 'Valid 8-digit Tariff item level HSN code (Mandatory for import/export).';
  }

  return [
    `CODE TESTED: ${clean}`,
    `CLASSIFICATION: ${isSac ? 'SAC (Services)' : 'HSN (Goods & Commodities)'}`,
    `STATUS: ${isValid ? '✅ VALID FORMAT' : '❌ INVALID FORMAT (Must be 2, 4, 6, or 8 digits for HSN; 6 digits starting with 99 for SAC)'}`,
    `DETAILS: ${desc || 'Syntax error or incorrect digit length.'}`
  ].join('\n');
}

// 11. Profit Margin Calculator
export function calculateProfitMargin(cost: number, revenue: number): string {
  const profit = revenue - cost;
  const grossMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;

  return [
    `════════════════════════════════════════════════════════════════`,
    `                 PROFIT MARGIN ANALYSIS REPORT                  `,
    `════════════════════════════════════════════════════════════════`,
    `TOTAL REVENUE:    $${revenue.toFixed(2)}`,
    `TOTAL COST:       $${cost.toFixed(2)}`,
    `NET PROFIT:       $${profit.toFixed(2)}`,
    `GROSS MARGIN:     ${grossMargin.toFixed(2)}%`,
    `MARKUP ON COST:   ${markup.toFixed(2)}%`
  ].join('\n');
}

// 12. Markup Calculator
export function calculateMarkup(cost: number, markupPercentage: number): string {
  const markupAmount = cost * (markupPercentage / 100);
  const price = cost + markupAmount;
  const margin = price > 0 ? (markupAmount / price) * 100 : 0;

  return [
    `ITEM COST:        $${cost.toFixed(2)}`,
    `MARKUP PERCENT:   ${markupPercentage}%`,
    `MARKUP AMOUNT:    $${markupAmount.toFixed(2)}`,
    `RECOMMENDED PRICE:$${price.toFixed(2)}`,
    `EQUIVALENT MARGIN:${margin.toFixed(2)}%`
  ].join('\n');
}

// 13. Break-Even Calculator
export function calculateBreakEven(fixedCosts: number, unitSellingPrice: number, variableCostPerUnit: number): string {
  const cm = unitSellingPrice - variableCostPerUnit;
  if (cm <= 0) return 'Selling price must be greater than variable cost per unit to achieve break-even.';

  const breakEvenUnits = Math.ceil(fixedCosts / cm);
  const breakEvenRevenue = breakEvenUnits * unitSellingPrice;
  const cmRatio = (cm / unitSellingPrice) * 100;

  return [
    `════════════════════════════════════════════════════════════════`,
    `                  BREAK-EVEN HORIZON REPORT                     `,
    `════════════════════════════════════════════════════════════════`,
    `FIXED OVERHEAD COSTS:      $${fixedCosts.toLocaleString()}`,
    `UNIT SELLING PRICE:        $${unitSellingPrice.toFixed(2)}`,
    `VARIABLE COST PER UNIT:    $${variableCostPerUnit.toFixed(2)}`,
    `CONTRIBUTION MARGIN (CM):  $${cm.toFixed(2)} (${cmRatio.toFixed(1)}%)`,
    `────────────────────────────────────────────────────────────────`,
    `BREAK-EVEN VOLUME:         ${breakEvenUnits.toLocaleString()} Units`,
    `BREAK-EVEN SALES DOLLARS:  $${breakEvenRevenue.toLocaleString()}`
  ].join('\n');
}

// 14. Unit Price Calculator
export function calculateUnitPrice(items: { label: string; price: number; quantity: number; unit: string }[]): string {
  const results = items.map(it => {
    const unitPrice = it.quantity > 0 ? it.price / it.quantity : 0;
    return { ...it, unitPrice };
  });

  results.sort((a, b) => a.unitPrice - b.unitPrice);

  return [
    `════════════════════════════════════════════════════════════════`,
    `                  UNIT PRICE COMPARISON MATRIX                  `,
    `════════════════════════════════════════════════════════════════`,
    ...results.map((r, i) => `  ${i === 0 ? '🏆 BEST VALUE:' : '   Option:    '} ${r.label} -> $${r.unitPrice.toFixed(4)} per ${r.unit} (Total: $${r.price.toFixed(2)} for ${r.quantity} ${r.unit})`),
    ``,
    `SAVINGS NOTE: Choosing the top option saves you money per unit volume.`
  ].join('\n');
}

// 15. Bulk Purchase Price Calculator
export function calculateBulkPurchasePrice(qty: number, basePrice: number, tiers: { minQty: number; discount: number }[]): string {
  let appliedDiscount = 0;
  tiers.sort((a, b) => b.minQty - a.minQty);
  for (const t of tiers) {
    if (qty >= t.minQty) {
      appliedDiscount = t.discount;
      break;
    }
  }

  const unitPrice = basePrice * (1 - appliedDiscount / 100);
  const total = qty * unitPrice;
  const standardTotal = qty * basePrice;
  const savings = standardTotal - total;

  return [
    `ORDER QUANTITY:       ${qty.toLocaleString()} Units`,
    `BASE LIST PRICE:      $${basePrice.toFixed(2)} / unit`,
    `VOLUME DISCOUNT:      ${appliedDiscount}%`,
    `EFFECTIVE UNIT PRICE: $${unitPrice.toFixed(2)} / unit`,
    `TOTAL PURCHASE ORDER: $${total.toFixed(2)}`,
    `TOTAL VOLUME SAVINGS: $${savings.toFixed(2)}`
  ].join('\n');
}

// 16. Cost Per Item Calculator
export function calculateCostPerItem(params: {
  manufacturingCost: number;
  freightCost: number;
  dutiesAndTaxes: number;
  packagingCost: number;
  totalUnits: number;
}): string {
  const units = params.totalUnits > 0 ? params.totalUnits : 1;
  const totalCost = params.manufacturingCost + params.freightCost + params.dutiesAndTaxes + params.packagingCost;
  const perUnit = totalCost / units;

  return [
    `════════════════════════════════════════════════════════════════`,
    `                TRUE LANDED COST PER ITEM                       `,
    `════════════════════════════════════════════════════════════════`,
    `TOTAL PRODUCTION RUN: ${units.toLocaleString()} Units`,
    `MANUFACTURING TOTAL:  $${params.manufacturingCost.toFixed(2)}`,
    `FREIGHT & LOGISTICS:  $${params.freightCost.toFixed(2)}`,
    `CUSTOMS & DUTIES:     $${params.dutiesAndTaxes.toFixed(2)}`,
    `PACKAGING & BARCODES: $${params.packagingCost.toFixed(2)}`,
    `────────────────────────────────────────────────────────────────`,
    `TOTAL ACCUMULATED:    $${totalCost.toFixed(2)}`,
    `TRUE LANDED UNIT COST:$${perUnit.toFixed(2)} / unit`
  ].join('\n');
}

// 17. Sales Commission Calculator
export function calculateSalesCommission(salesVolume: number, baseRate: number = 5, quotaBonus: number = 0): string {
  const baseCommission = salesVolume * (baseRate / 100);
  const totalCommission = baseCommission + quotaBonus;

  return [
    `TOTAL SALES VOLUME:   $${salesVolume.toLocaleString()}`,
    `BASE COMMISSION RATE: ${baseRate}%`,
    `BASE EARNED:          $${baseCommission.toFixed(2)}`,
    `QUOTA BONUS:          $${quotaBonus.toFixed(2)}`,
    `TOTAL PAYOUT:         $${totalCommission.toFixed(2)}`
  ].join('\n');
}

// 18. Salary Calculator
export function calculateSalary(ctcAnnual: number): string {
  const ctcMonthly = ctcAnnual / 12;
  const basic = ctcMonthly * 0.50; // 50% basic
  const hra = basic * 0.40; // 40% of basic
  const specialAllowance = ctcMonthly - (basic + hra);

  // Standard deductions
  const pfEmployee = Math.min(1800, basic * 0.12);
  const professionalTax = 200;
  const estimatedTax = ctcAnnual > 700000 ? (ctcMonthly * 0.08) : 0;

  const totalDeductions = pfEmployee + professionalTax + estimatedTax;
  const inHandMonthly = ctcMonthly - totalDeductions;

  return [
    `════════════════════════════════════════════════════════════════`,
    `             ANNUAL CTC TO MONTHLY IN-HAND SALARY               `,
    `════════════════════════════════════════════════════════════════`,
    `ANNUAL CTC:          ₹${ctcAnnual.toLocaleString()}`,
    `MONTHLY GROSS PAY:   ₹${ctcMonthly.toFixed(2)}`,
    ``,
    `MONTHLY EARNINGS STRUCTURE:`,
    `  • Basic Salary:    ₹${basic.toFixed(2)}`,
    `  • HRA Allowance:   ₹${hra.toFixed(2)}`,
    `  • Special / Other: ₹${specialAllowance.toFixed(2)}`,
    ``,
    `MONTHLY DEDUCTIONS:`,
    `  • Provident Fund (PF): ₹${pfEmployee.toFixed(2)}`,
    `  • Professional Tax:    ₹${professionalTax.toFixed(2)}`,
    `  • Estimated Income Tax:₹${estimatedTax.toFixed(2)}`,
    `────────────────────────────────────────────────────────────────`,
    `ESTIMATED TAKE-HOME: ₹${inHandMonthly.toFixed(2)} / month`
  ].join('\n');
}

// 19. Overtime Pay Calculator
export function calculateOvertimePay(regularHours: number, hourlyRate: number, overtimeHours: number, multiplier: number = 1.5): string {
  const regPay = regularHours * hourlyRate;
  const otRate = hourlyRate * multiplier;
  const otPay = overtimeHours * otRate;
  const totalPay = regPay + otPay;

  return [
    `REGULAR EARNINGS:  $${regPay.toFixed(2)} (${regularHours} hrs @ $${hourlyRate.toFixed(2)}/hr)`,
    `OVERTIME EARNINGS: $${otPay.toFixed(2)} (${overtimeHours} hrs @ $${otRate.toFixed(2)}/hr [${multiplier}x])`,
    `GROSS PAYROLL:     $${totalPay.toFixed(2)} (Total ${regularHours + overtimeHours} hours)`
  ].join('\n');
}

// 20. Work Hours Calculator
export function calculateWorkHours(startTime: string, endTime: string, breakMinutes: number = 30): string {
  // Parses "09:00" and "17:30"
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);

  const startTotal = (sh || 9) * 60 + (sm || 0);
  const endTotal = (eh || 17) * 60 + (em || 0);

  let diffMinutes = endTotal - startTotal;
  if (diffMinutes < 0) diffMinutes += 24 * 60; // Overnight shift
  diffMinutes = Math.max(0, diffMinutes - breakMinutes);

  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  const decimalHours = (diffMinutes / 60).toFixed(2);

  return [
    `SHIFT START:       ${startTime}`,
    `SHIFT END:         ${endTime}`,
    `UNPAID BREAK DED:  ${breakMinutes} minutes`,
    `NET WORKED TIME:   ${hours} Hours, ${mins} Minutes (${decimalHours} Decimal Hours)`
  ].join('\n');
}

// 21. Timesheet Calculator
export function calculateTimesheet(dailyHours: number[], hourlyWage: number = 25): string {
  const totalHours = dailyHours.reduce((acc, h) => acc + h, 0);
  const regular = Math.min(40, totalHours);
  const overtime = Math.max(0, totalHours - 40);

  const regularPay = regular * hourlyWage;
  const otPay = overtime * (hourlyWage * 1.5);
  const gross = regularPay + otPay;

  return [
    `════════════════════════════════════════════════════════════════`,
    `                 WEEKLY TIMESHEET SUMMARY                       `,
    `════════════════════════════════════════════════════════════════`,
    `DAILY BREAKDOWN: [ ${dailyHours.map(h => `${h}h`).join(', ')} ]`,
    `TOTAL WORKED:    ${totalHours.toFixed(1)} Hours`,
    `REGULAR HOURS:   ${regular.toFixed(1)} Hours ($${regularPay.toFixed(2)})`,
    `OVERTIME HOURS:  ${overtime.toFixed(1)} Hours ($${otPay.toFixed(2)})`,
    `GROSS PAYABLE:   $${gross.toFixed(2)}`
  ].join('\n');
}

// 22. Attendance Percentage Calculator
export function calculateAttendancePercentage(totalWorkingDays: number, presentDays: number, halfDays: number = 0): string {
  const effectivePresent = presentDays + (halfDays * 0.5);
  const absentDays = totalWorkingDays - effectivePresent;
  const pct = totalWorkingDays > 0 ? ((effectivePresent / totalWorkingDays) * 100).toFixed(1) : '0';

  return [
    `TOTAL WORKING DAYS:  ${totalWorkingDays}`,
    `DAYS PRESENT:        ${presentDays}`,
    `HALF DAYS (0.5x):    ${halfDays}`,
    `DAYS ABSENT:         ${absentDays}`,
    `ATTENDANCE RATE:     ${pct}% ${Number(pct) >= 75 ? '✅ Meets Minimum Requirement' : '⚠️ Below 75% Threshold'}`
  ].join('\n');
}

// 23. Leave Balance Calculator
export function calculateLeaveBalance(entitlementAnnual: number, leavesTaken: number, monthlySalary: number = 60000): string {
  const remaining = entitlementAnnual - leavesTaken;
  const perDayPay = monthlySalary / 30;
  const encashmentValue = Math.max(0, remaining * perDayPay);

  return [
    `ANNUAL ALLOCATION:   ${entitlementAnnual} Days`,
    `LEAVES CONSUMED:     ${leavesTaken} Days`,
    `REMAINING BALANCE:   ${remaining} Days`,
    `ESTIMATED ENCASHMENT:₹${encashmentValue.toFixed(2)} (Based on daily wage ₹${perDayPay.toFixed(2)})`
  ].join('\n');
}

// 24. Business Days Due Date Calculator
export function calculateBusinessDaysDueDate(startDate: Date, businessDaysToAdd: number): string {
  const cur = new Date(startDate);
  let added = 0;

  while (added < businessDaysToAdd) {
    cur.setDate(cur.getDate() + 1);
    const day = cur.getDay();
    if (day !== 0 && day !== 6) { // Skip Saturday and Sunday
      added++;
    }
  }

  return [
    `START DATE:     ${startDate.toISOString().slice(0, 10)}`,
    `BUSINESS DAYS:  +${businessDaysToAdd} working days`,
    `PROJECTED DUE:  ${cur.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
  ].join('\n');
}

// 25. Payment Terms Calculator
export function calculatePaymentTerms(invoiceDate: Date, terms: 'NET30' | 'NET60' | '2/10_NET30' | 'COD' = 'NET30', amount: number = 1000): string {
  const due = new Date(invoiceDate);
  let discountNote = 'No early payment cash discount applied.';

  if (terms === 'NET30') {
    due.setDate(due.getDate() + 30);
  } else if (terms === 'NET60') {
    due.setDate(due.getDate() + 60);
  } else if (terms === '2/10_NET30') {
    const discountDue = new Date(invoiceDate);
    discountDue.setDate(discountDue.getDate() + 10);
    due.setDate(due.getDate() + 30);
    const discAmount = amount * 0.02;
    discountNote = `2% Discount Available ($${(amount - discAmount).toFixed(2)}) if paid by ${discountDue.toISOString().slice(0, 10)}.`;
  }

  return [
    `TERMS SELECTED: ${terms}`,
    `INVOICE DATE:   ${invoiceDate.toISOString().slice(0, 10)}`,
    `FINAL DUE DATE: ${due.toISOString().slice(0, 10)}`,
    `CASH INCENTIVE: ${discountNote}`
  ].join('\n');
}

// 26. Invoice Due Date Calculator
export function calculateInvoiceDueDate(invoiceDateStr: string, netDays: number = 30): string {
  const inv = new Date(invoiceDateStr);
  const due = new Date(inv);
  due.setDate(due.getDate() + netDays);

  const today = new Date();
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);

  return [
    `INVOICE ISSUE DATE: ${inv.toISOString().slice(0, 10)}`,
    `CREDIT PERIOD:      ${netDays} Days`,
    `MATURITY DUE DATE:  ${due.toISOString().slice(0, 10)}`,
    `AGING STATUS:       ${diffDays >= 0 ? `${diffDays} Days Remaining until maturity` : `⚠️ OVERDUE by ${Math.abs(diffDays)} Days`}`
  ].join('\n');
}

// 27. Purchase Order Total Calculator
export function calculatePurchaseOrderTotal(subtotal: number, freight: number = 0, customs: number = 0, taxRate: number = 10): string {
  const taxable = subtotal + freight + customs;
  const tax = taxable * (taxRate / 100);
  const poTotal = taxable + tax;

  return [
    `GOODS SUBTOTAL:  $${subtotal.toFixed(2)}`,
    `FREIGHT & POST:  +$${freight.toFixed(2)}`,
    `CUSTOMS DUTIES:  +$${customs.toFixed(2)}`,
    `TAX (${taxRate}%):         +$${tax.toFixed(2)}`,
    `TOTAL PO COMMIT: $${poTotal.toFixed(2)}`
  ].join('\n');
}

// 28. Cash Discount Calculator
export function calculateCashDiscount(amount: number, discountPct: number = 2, discountDays: number = 10, netDays: number = 30): string {
  const savings = amount * (discountPct / 100);
  const discountedPay = amount - savings;
  // Annualized return formula: (Discount % / (100 - Discount %)) * (365 / (Net Days - Discount Days))
  const apr = (discountPct / (100 - discountPct)) * (365 / (netDays - discountDays)) * 100;

  return [
    `ORIGINAL INVOICE:      $${amount.toFixed(2)}`,
    `EARLY PAY DISCOUNT:    -$${savings.toFixed(2)} (${discountPct}%)`,
    `DISCOUNTED PAYABLE:    $${discountedPay.toFixed(2)}`,
    `IMPLIED ANNUAL APR:    ${apr.toFixed(1)}% (Annualized return on early payment liquidity)`
  ].join('\n');
}

// 29. Inventory Reorder Point Calculator
export function calculateReorderPoint(dailyDemand: number, leadTimeDays: number, safetyStock: number): string {
  const leadTimeDemand = dailyDemand * leadTimeDays;
  const reorderPoint = leadTimeDemand + safetyStock;

  return [
    `DAILY AVERAGE DEMAND: ${dailyDemand} units/day`,
    `SUPPLIER LEAD TIME:   ${leadTimeDays} Days`,
    `LEAD TIME DEMAND:     ${leadTimeDemand} Units`,
    `SAFETY STOCK BUFFER:  ${safetyStock} Units`,
    `────────────────────────────────────────────────────────────────`,
    `TRIGGER REORDER POINT:${reorderPoint} Units`,
    `ACTION: Trigger purchase order when inventory drops to or below ${reorderPoint} units.`
  ].join('\n');
}

// 30. Stock Valuation Calculator
export function calculateStockValuation(batches: { qty: number; unitCost: number }[], unitsSold: number): string {
  let totalQty = batches.reduce((a, b) => a + b.qty, 0);
  let totalCost = batches.reduce((a, b) => a + (b.qty * b.unitCost), 0);
  let wacPerUnit = totalQty > 0 ? totalCost / totalQty : 0;

  // FIFO COGS
  let remainingToSell = unitsSold;
  let fifoCogs = 0;
  for (const batch of batches) {
    if (remainingToSell <= 0) break;
    const take = Math.min(batch.qty, remainingToSell);
    fifoCogs += take * batch.unitCost;
    remainingToSell -= take;
  }
  const fifoEndingInventory = totalCost - fifoCogs;

  return [
    `════════════════════════════════════════════════════════════════`,
    `               INVENTORY VALUATION AUDIT (FIFO vs WAC)          `,
    `════════════════════════════════════════════════════════════════`,
    `TOTAL INVENTORY RECEIVED: ${totalQty} Units ($${totalCost.toFixed(2)})`,
    `UNITS DISPATCHED / SOLD:  ${unitsSold} Units`,
    `ENDING UNITS ON HAND:     ${Math.max(0, totalQty - unitsSold)} Units`,
    ``,
    `FIFO VALUATION:`,
    `  • Cost of Goods Sold (COGS): $${fifoCogs.toFixed(2)}`,
    `  • Ending Inventory Value:    $${fifoEndingInventory.toFixed(2)}`,
    ``,
    `WEIGHTED AVERAGE COST (WAC):`,
    `  • Average Cost Per Unit:     $${wacPerUnit.toFixed(2)}`,
    `  • WAC Ending Inventory:      $${((totalQty - unitsSold) * wacPerUnit).toFixed(2)}`
  ].join('\n');
}
