import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import LoanService from "@/services/loan-service"
import { type LoanResponse } from "@/types/loan"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const samplePersonalCodes: string[] = [
  "49002010965",
  "49002010976",
  "49002010987",
  "49002010998",
] as const

const loanDecisionSchema = z.object({
  personalCode: z
    .string()
    .length(11, "Personal code must be exactly 11 characters"),
  amount: z.coerce
    .number<number>()
    .min(2000, "Amount must be at least 2000")
    .max(10000, "Amount must be at most 10000"),
  period: z.coerce
    .number<number>()
    .min(12, "Period must be at least 12 months")
    .max(60, "Period must be at most 60 months"),
})

export function App() {
  const [submitting, setSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [fetchedResult, setFetchedResult] = useState<LoanResponse | null>(null)

  const form = useForm<z.infer<typeof loanDecisionSchema>>({
    resolver: zodResolver(loanDecisionSchema),
    defaultValues: {
      personalCode: samplePersonalCodes[0],
      amount: 4000,
      period: 12,
    },
  })

  async function onSubmit(data: z.infer<typeof loanDecisionSchema>) {
    setSubmitting(true)
    setFetchedResult(null)
    try {
      const res = await LoanService.GenerateLoanDecision(data)
      setFetchedResult(res.data)
      setIsDialogOpen(true)
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong!")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen justify-center bg-gray-800 p-20">
      <Card className="h-min p-10">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <h1 className="text-center text-xl font-semibold">
            Apply for a loan
          </h1>

          <Controller
            name="personalCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="personalCode">Personal Code</FieldLabel>
                <Input
                  {...field}
                  id="personalCode"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="amount">Amount (€)</FieldLabel>
                <Input
                  {...field}
                  id="amount"
                  type="number"
                  min={2000}
                  max={10000}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="period"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="period">Period (months)</FieldLabel>
                <Input
                  {...field}
                  id="period"
                  type="number"
                  min={12}
                  max={60}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button disabled={submitting}>Apply</Button>
        </form>

        <p className="text-muted-foreground">
          Sample personal codes: {samplePersonalCodes.join(", ")}
        </p>
      </Card>

      {fetchedResult && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogTitle>
              {fetchedResult.approved ? "Congratulations!" : "We are sorry!"}
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-2">
              <span>
                {fetchedResult.approved
                  ? `We are able to loan you up to ${fetchedResult.maxAmount}€ for a period of ${fetchedResult.period} months.`
                  : "We cannot approve your loan."}
              </span>
              <span>
                {!fetchedResult.approved &&
                  fetchedResult.maxAmount > 0 &&
                  fetchedResult.period > 0 &&
                  ` However, we might be able to offer you a loan of ${fetchedResult.maxAmount}€ for a period of ${fetchedResult.period} months.`}
              </span>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default App
