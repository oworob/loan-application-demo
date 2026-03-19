import axios, { type AxiosInstance } from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

const ApiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

export default abstract class BaseService {
  protected url: string
  protected ApiClient: AxiosInstance

  constructor(url: string) {
    this.url = url
    this.ApiClient = ApiClient
  }
}
