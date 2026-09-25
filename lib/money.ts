/**
 * Minor unit (paise) money utility.
 * Always stores currency as integer paise to prevent floating-point errors.
 */

export function paiseToRupees(paise: number): number {
  return paise / 100
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100)
}

export function formatCurrency(
  paise: number,
  currencySymbol = '₹',
  locale = 'en-IN'
): string {
  const rupees = paiseToRupees(paise)
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees)

  return `${currencySymbol}${formatted}`
}

export function calculateGST(
  amountPaise: number,
  cgstRate = 9,
  sgstRate = 9,
  taxInclusive = false
) {
  const totalRatePct = cgstRate + sgstRate
  let basePaise = 0
  let totalTaxPaise = 0

  if (taxInclusive) {
    basePaise = Math.round((amountPaise * 100) / (100 + totalRatePct))
    totalTaxPaise = amountPaise - basePaise
  } else {
    basePaise = amountPaise
    totalTaxPaise = Math.round((amountPaise * totalRatePct) / 100)
  }

  const cgstPaise = Math.round(totalTaxPaise / 2)
  const sgstPaise = totalTaxPaise - cgstPaise
  const finalPaise = basePaise + totalTaxPaise

  return {
    basePaise,
    cgstPaise,
    sgstPaise,
    totalTaxPaise,
    finalPaise,
  }
}
