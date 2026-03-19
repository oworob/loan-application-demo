import BaseService from "@/services/base-service"
import type { IApiResponse } from "@/types/api-response"
import type { LoanRequest, LoanResponse } from "@/types/loan"

class LoanService extends BaseService {
  constructor() {
    super("/loans")
  }

  GenerateLoanDecision(data: LoanRequest): Promise<IApiResponse<LoanResponse>> {
    return this.ApiClient.post(`${this.url}/decision`, data)
  }
}

export default new LoanService()
