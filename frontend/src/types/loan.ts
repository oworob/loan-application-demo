export interface LoanRequest {
  personalCode: string
  amount: number
  period: number
}

export interface LoanResponse {
  readonly approved: boolean
  readonly maxAmount: number
  readonly period: number
}
