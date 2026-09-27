/**
 * Business Operations Client-Side Engines
 * 100% browser-native purchase orders, quotations, delivery notes, receipts,
 * inventory reconciliation, ledgers, SKU generators, and P&L worksheets.
 */

/** 1. Purchase Order Generator */
export function generatePurchaseOrder(input: string): string {
  const poNum = 'PO-2026-0984';
  const today = new Date().toISOString().split('T')[0];

  return `=======================================================
               PURCHASE ORDER (PO)
=======================================================
PO Number   : ${poNum}
Date        : ${today}
Vendor      : Global Tech Components Inc.
Buyer       : EncryptDecrypt Operations LLC

Payment Terms: Net 30
Shipping Method: FedEx Priority Freight

ITEM  DESCRIPTION                   QTY   UNIT PRICE   TOTAL
----  ----------------------------  ---   ----------   ---------
01    Server Rack Rails 2U          10    $65.00       $650.00
02    Hardware Security Modules     4     $1,200.00    $4,800.00
03    Cat6A Shielded Patch Cable    50    $8.50        $425.00

-------------------------------------------------------
SUBTOTAL                                               $5,875.00
ESTIMATED TAX (0% B2B Resale Exemption)                $0.00
SHIPPING & HANDLING                                    $120.00
-------------------------------------------------------
TOTAL PURCHASE ORDER AMOUNT                            $5,995.00
=======================================================
Authorized Signature: _______________________ Date: ___`;
}

/** 2. Quotation Generator */
export function generateQuotation(input: string): string {
  const quoteNum = 'QT-2026-441';
  const today = new Date().toISOString().split('T')[0];

  return `=======================================================
               FORMAL PRICE QUOTATION
=======================================================
Quote Number : ${quoteNum}
Date Issued  : ${today}
Valid Until  : 30 Days from Issue
Customer     : Enterprise Client Corp

SCOPE OF SERVICES / DELIVERABLES:
1. Client-Side Cryptographic Suite Integration     : $4,500.00
2. Custom Zero-Knowledge Authentication Flow       : $3,200.00
3. Security Hardening & WCAG 2.1 AAA Audit         : $1,800.00

-------------------------------------------------------
PROJECT ESTIMATE TOTAL                             $9,500.00
-------------------------------------------------------
Terms: 50% Upfront Milestone, 50% upon Production Delivery.`;
}

/** 3. Delivery Note Generator */
export function generateDeliveryNote(input: string): string {
  const noteNum = 'DN-88410';
  const today = new Date().toISOString().split('T')[0];

  return `=======================================================
               DELIVERY NOTE / PACKING SLIP
=======================================================
Delivery Note #: ${noteNum}
Date Dispatched: ${today}
Carrier / Tracking: DHL Express #940010920491

Delivered To: Acme Data Center, 500 Technology Way, Austin TX

BOX #  CONTENTS                      QTY ORDERED  QTY SHIPPED
-----  ----------------------------  -----------  -----------
1 of 2 Enterprise Encrypted Drives   20 units     20 units
2 of 2 Backup Power Supplies (UPS)   2 units      2 units

Status: All items verified and packed in undamaged condition.
Receiver Signature: ___________________ Received Date: _______`;
}

/** 4. Payment Receipt Generator */
export function generatePaymentReceipt(input: string): string {
  const receiptNum = 'REC-2026-1029';
  const today = new Date().toISOString().split('T')[0];

  return `=======================================================
               OFFICIAL PAYMENT RECEIPT
=======================================================
Receipt Number : ${receiptNum}
Transaction Date: ${today}
Paid By        : John Doe (john@example.com)
Payment Method : Credit Card (Visa ending in 4242)

DESCRIPTION                           AMOUNT
------------------------------------  ---------
Annual Pro Developer License (1 Year) $240.00
Applicable Sales Tax                  $0.00
------------------------------------  ---------
TOTAL AMOUNT PAID (USD)               $240.00

Status: COMPLETED (Transaction Ref: #txn_9941a8b7)`;
}

/** 5. Business Expense Report Template */
export function generateExpenseReport(input: string): string {
  return `=== EMPLOYEE BUSINESS EXPENSE REIMBURSEMENT REPORT ===
Employee Name : Jane Smith
Department    : Security Engineering
Period        : September 2026

Date        Category      Description                 Amount    Receipt?
----------  ------------  --------------------------  --------  --------
2026-09-22  Travel        Flight to Tech Conference   $420.00   ✓ Attached
2026-09-23  Lodging       Hotel (2 Nights)            $360.00   ✓ Attached
2026-09-23  Meals         Client Working Dinner       $115.40   ✓ Attached
2026-09-24  Transport     Rideshare to Airport        $45.00    ✓ Attached

Total Expense Claim : $940.40
Approval Status     : Pending Manager Sign-off`;
}

/** 6. Inventory Stock Sheet Generator */
export function generateInventoryStockSheet(input: string): string {
  return `=== INVENTORY STOCK RECORD SHEET ===

SKU         Product Name           Location  In Stock  Reorder Pt  Unit Cost
----------  ---------------------  --------  --------  ----------  ---------
SEC-DRV-01  Encrypted USB 128GB    Shelf A1  142       25          $18.50
NET-CAB-05  Cat6 Patch Cable 5m    Shelf B3  410       50          $2.40
SRV-PWR-02  Redundant PSU 750W     Rack C2   18        5           $85.00
KEY-FOB-09  FIDO2 Hardware Key     Shelf A4  85        20          $22.00

Total Unique SKUs: 4 | Total Units on Hand: 655 units`;
}

/** 7. Stock Reconciliation Worksheet */
export function generateStockReconciliation(input: string): string {
  return `=== STOCK AUDIT RECONCILIATION REPORT ===

SKU         System Count  Physical Count  Variance  Status       Valuation Diff
----------  ------------  --------------  --------  -----------  --------------
SEC-DRV-01  145           142             -3        Shrinkage    -$55.50
NET-CAB-05  410           410              0        Balanced      $0.00
SRV-PWR-02  17            18             +1        Surplus      +$85.00
KEY-FOB-09  85            85               0        Balanced      $0.00

Net Variance: -$29.50 (99.5% Stock Accuracy Rating)`;
}

/** 8. Purchase Register Template */
export function generatePurchaseRegister(input: string): string {
  return `=== MONTHLY PURCHASE REGISTER ===

Date        PO #         Supplier Name            Invoice #  Gross Amount  Tax (GST)  Net Amount
----------  -----------  -----------------------  ---------  ------------  ---------  ----------
2026-09-05  PO-2026-001  Alpha Components Ltd     INV-881    $1,200.00     $120.00    $1,080.00
2026-09-12  PO-2026-002  Cloud Hosting Solutions  INV-401    $450.00       $0.00      $450.00
2026-09-20  PO-2026-003  Office Depot Supply      INV-912    $320.00       $25.60     $294.40

Total Purchases: $1,970.00 | Total Tax Credit: $145.60`;
}

/** 9. Sales Register Template */
export function generateSalesRegister(input: string): string {
  return `=== MONTHLY SALES REGISTER ===

Date        Invoice #    Customer Name            Payment    Subtotal   Tax       Total
----------  -----------  -----------------------  ---------  ---------  --------  ---------
2026-09-02  INV-2026-81  Apex Global Corp         Stripe     $2,500.00  $200.00   $2,700.00
2026-09-15  INV-2026-82  Quantum Labs Inc         Wire       $5,000.00  $0.00     $5,000.00
2026-09-24  INV-2026-83  Beta Dev Studio          Credit     $1,200.00  $96.00    $1,296.00

Total Gross Sales: $8,996.00 | Net Revenue: $8,700.00`;
}

/** 10. Customer Ledger Template */
export function generateCustomerLedger(input: string): string {
  return `=== CUSTOMER ACCOUNT STATEMENT & LEDGER ===
Customer Name : Apex Global Corp (Account #CUST-9012)
Statement As Of: September 2026

Date        Particulars                  Debit (Due)  Credit (Paid)  Balance
----------  ---------------------------  -----------  -------------  ----------
2026-09-01  Opening Balance                                          $0.00
2026-09-02  Invoice #INV-2026-81         $2,700.00                   $2,700.00
2026-09-10  Payment Received (Stripe)                 $2,700.00      $0.00
2026-09-25  Invoice #INV-2026-90         $1,500.00                   $1,500.00

Current Outstanding Due: $1,500.00 (Due Date: 2026-10-25)`;
}

/** 11. Vendor Ledger Template */
export function generateVendorLedger(input: string): string {
  return `=== VENDOR STATEMENT OF ACCOUNT ===
Vendor Name: Alpha Components Ltd (Vendor #VEND-4401)

Date        Transaction / Ref            Debit (Paid)  Credit (Billed)  Balance
----------  ---------------------------  ------------  ---------------  ----------
2026-09-01  Opening Balance                                             $0.00
2026-09-05  Bill #INV-881                              $1,200.00        $1,200.00
2026-09-20  ACH Payment Transferred      $1,200.00                      $0.00

Current Payable Balance: $0.00 (Account in Good Standing)`;
}

/** 12. Daily Cash Book Template */
export function generateDailyCashBook(input: string): string {
  return `=== TWO-COLUMN DAILY CASH BOOK ===
Date: 2026-09-27

RECEIPTS (DEBIT)                          PAYMENTS (CREDIT)
Particulars            Cash      Bank     Particulars            Cash     Bank
---------------------  --------  -------  ---------------------  -------  -------
Opening Balance        $450.00   $8,200   Office Supplies Exp    $45.00   --
Cash Sales from Store  $280.00   --       Courier / Postage      $15.00   --
Client Bank Transfer   --        $1,500   Cloud Hosting Auto-Pay --       $180.00
                                          Closing Balance        $670.00  $9,520
---------------------  --------  -------  ---------------------  -------  -------
Total                  $730.00   $9,700   Total                  $730.00  $9,700`;
}

/** 13. Petty Cash Calculator */
export function calculatePettyCash(input: string): string {
  const floatLimit = 250.00;
  const receipts = [18.50, 32.00, 14.25, 45.00, 22.10];
  const totalSpent = receipts.reduce((a, b) => a + b, 0);
  const remainingCash = floatLimit - totalSpent;

  return `=== PETTY CASH IMPREST FLOAT SYSTEM ===
Authorized Imprest Float: $${floatLimit.toFixed(2)}

Vouchers / Expenses Logged:
1. Coffee & Milk for Kitchen : $18.50
2. Registered Mail Postage   : $32.00
3. Taxi fare for errand      : $14.25
4. Printer paper box         : $45.00
5. Hardware store connectors : $22.10

Summary:
• Total Petty Cash Spent : $${totalSpent.toFixed(2)}
• Physical Cash Remaining: $${remainingCash.toFixed(2)}
• Reimbursement Required : $${totalSpent.toFixed(2)} (To restore $${floatLimit.toFixed(2)} float)`;
}

/** 14. Product Pricing Worksheet */
export function generateProductPricing(input: string): string {
  const cost = 45.00;
  const markupPct = 60; // 60%
  const sellingPrice = cost * (1 + markupPct / 100);
  const grossMarginPct = ((sellingPrice - cost) / sellingPrice) * 100;

  return `=== COST-PLUS PRODUCT PRICING FORMULA ===
Unit Cost of Goods (COGS): $${cost.toFixed(2)}
Target Markup Percentage : ${markupPct}%

Pricing Calculations:
• Recommended Retail Price (MSRP): $${sellingPrice.toFixed(2)}
• Gross Profit per Unit          : $${(sellingPrice - cost).toFixed(2)}
• Effective Gross Margin         : ${grossMarginPct.toFixed(1)}%`;
}

/** 15. Business Name Brainstorming Tool */
export function brainstormBusinessName(input: string): string {
  const keyword = (input || 'Security').trim();
  return `=== BRAND & BUSINESS NAME GENERATOR ===
Keyword Concept: "${keyword}"

Brand Ideas by Style:
• Modern & Minimalist : ${keyword}ly, ${keyword}io, Omni${keyword}
• Authority & Tech    : Cyber${keyword}, ${keyword}Core, Nexus${keyword}
• Action & Agility    : Swift${keyword}, ${keyword}Pulse, Hyper${keyword}
• Abstract & Compound : Fortis${keyword}, ${keyword}Grid, Veri${keyword}

Domain Availability Advice: Check .org, .dev, and .io TLDs for developer SaaS.`;
}

/** 16. SKU Generator */
export function generateSku(input: string): string {
  // Format: [CATEGORY]-[PRODUCT]-[VARIANT]-[SIZE]
  return `=== PRODUCT SKU (STOCK KEEPING UNIT) BUILDER ===

Examples Generated:
• Software SaaS       : \`SOFT-ENC-PRO-ANNUAL\`
• Hardware Appliance  : \`HW-HSM-2U-BLK-US\`
• Apparel Merch       : \`APP-TEE-LOGO-NVY-XL\`
• Accessories         : \`ACC-FOB-FIDO2-WHT-01\`

Syntax Standard: Short uppercase alphanumeric blocks separated by hyphens.`;
}

/** 17. Product Code Generator */
export function generateProductCode(input: string): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `=== INTERNAL PRODUCT CODE / PART NUMBER ===
Product Identifier : PRD-2026-${num}
UPC-A Equivalent   : 0${num}12345
Barcoding Standard : Code 128 Compliant`;
}

/** 18. Inventory Turnover Calculator */
export function calculateInventoryTurnover(input: string): string {
  const cogs = 240000;
  const avgInventory = 40000;
  const turnoverRatio = cogs / avgInventory;
  const daysOnHand = 365 / turnoverRatio;

  return `=== INVENTORY TURNOVER & EFFICIENCY RATIO ===
Cost of Goods Sold (Annual COGS): $${cogs.toLocaleString()}.00
Average Inventory Valuation     : $${avgInventory.toLocaleString()}.00

Efficiency Metrics:
• Inventory Turnover Ratio : ${turnoverRatio.toFixed(1)}× per year
• Days Sales of Inventory  : ${daysOnHand.toFixed(1)} Days to sell through inventory
• Rating                   : Healthy (Healthy benchmark is between 4× and 8×)`;
}

/** 19. Sales Target Calculator */
export function calculateSalesTarget(input: string): string {
  const annualTarget = 600000;
  const repCount = 5;

  return `=== SALES TARGET & QUOTA DISTRIBUTION ===
Annual Company Target : $${annualTarget.toLocaleString()}.00
Sales Team Headcount  : ${repCount} Reps

Distributed Quotas:
• Per-Representative Annual Quota : $${(annualTarget / repCount).toLocaleString()}.00
• Per-Representative Monthly Quota: $${(annualTarget / repCount / 12).toLocaleString()}.00
• Monthly Team Run Rate Required  : $${(annualTarget / 12).toLocaleString()}.00`;
}

/** 20. Profit and Loss Worksheet */
export function generateProfitAndLoss(input: string): string {
  const revenue = 120000;
  const cogs = 36000;
  const grossProfit = revenue - cogs;
  const opex = 42000;
  const netIncome = grossProfit - opex;

  return `=== SIMPLIFIED PROFIT AND LOSS (P&L) STATEMENT ===
Period: Q3 2026

TOTAL REVENUE / SALES                       $${revenue.toLocaleString()}.00
Less: Cost of Goods Sold (COGS)            -$${cogs.toLocaleString()}.00
-------------------------------------------------------
GROSS PROFIT                                $${grossProfit.toLocaleString()}.00 (Gross Margin: ${((grossProfit / revenue) * 100).toFixed(1)}%)

OPERATING EXPENSES (OPEX):
• Salaries & Compensation        $28,000.00
• Cloud Infrastructure & Hosting $6,500.00
• Marketing & Customer Acq.      $5,000.00
• Rent & Office Admin            $2,500.00
Total Operating Expenses                   -$${opex.toLocaleString()}.00
-------------------------------------------------------
NET OPERATING INCOME (EBIT)                 $${netIncome.toLocaleString()}.00 (Net Margin: ${((netIncome / revenue) * 100).toFixed(1)}%)`;
}
