'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitFundingRequest, type FormState } from '@/app/request/actions/submit'
import { Plus, Trash2, CheckCircle, Loader2, Send } from 'lucide-react'

type Founder = {
  id: string
  name: string
  linkedin: string
}

const initialState: FormState = {
  success: false,
  message: '',
}

export function FundingRequestForm() {
  const [state, formAction, isPending] = useActionState(submitFundingRequest, initialState)
  const [founders, setFounders] = useState<Founder[]>([
    { id: '1', name: '', linkedin: '' },
  ])

  const addFounder = () => {
    setFounders([...founders, { id: Date.now().toString(), name: '', linkedin: '' }])
  }

  const removeFounder = (id: string) => {
    if (founders.length > 1) {
      setFounders(founders.filter((f) => f.id !== id))
    }
  }

  const updateFounder = (id: string, field: 'name' | 'linkedin', value: string) => {
    setFounders(
      founders.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    )
  }

  // Combine founders into strings for form submission
  const founderNamesValue = founders.map((f) => f.name).filter(Boolean).join('\n')
  const founderLinkedinsValue = founders.map((f) => f.linkedin).filter(Boolean).join('\n')

  const resetForm = () => {
    setFounders([{ id: '1', name: '', linkedin: '' }])
    window.location.reload()
  }

  if (state.success && state.submissionId) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for your interest in SAIF. We&apos;ll review your application and get back to you soon.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Reference ID: <code className="rounded bg-muted px-2 py-1">{state.submissionId}</code>
        </p>
        <Button variant="outline" onClick={resetForm}>
          Submit Another Application
        </Button>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-8">
      {/* Honeypot field - hidden from users, visible to bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url">Website URL</label>
        <input
          type="text"
          id="website_url"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Hidden fields for combined founder data */}
      <input type="hidden" name="founderNames" value={founderNamesValue} />
      <input type="hidden" name="founderLinkedins" value={founderLinkedinsValue} />

      {/* Founders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold">Founders</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Add all co-founders with their LinkedIn profiles
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFounder}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Founder
          </Button>
        </div>

        <div className="space-y-3">
          {founders.map((founder, index) => (
            <div
              key={founder.id}
              className="grid gap-3 sm:grid-cols-2 p-4 rounded-lg border bg-muted/30"
            >
              <div className="space-y-2">
                <Label htmlFor={`founder-name-${founder.id}`} className="text-sm">
                  Name {index === 0 && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id={`founder-name-${founder.id}`}
                  placeholder="Jane Smith"
                  value={founder.name}
                  onChange={(e) => updateFounder(founder.id, 'name', e.target.value)}
                  required={index === 0}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`founder-linkedin-${founder.id}`} className="text-sm">
                    LinkedIn {index === 0 && <span className="text-destructive">*</span>}
                  </Label>
                  {founders.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeFounder(founder.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <Input
                  id={`founder-linkedin-${founder.id}`}
                  placeholder="https://linkedin.com/in/janesmith"
                  value={founder.linkedin}
                  onChange={(e) => updateFounder(founder.id, 'linkedin', e.target.value)}
                  required={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
        {state.errors?.founderNames && (
          <p className="text-sm text-destructive">{state.errors.founderNames[0]}</p>
        )}
        {state.errors?.founderLinkedins && (
          <p className="text-sm text-destructive">{state.errors.founderLinkedins[0]}</p>
        )}
      </div>

      {/* Company Info Section */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="companyName">
            Company Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Acme AI"
            required
            defaultValue={state.values?.companyName}
            aria-invalid={!!state.errors?.companyName}
          />
          {state.errors?.companyName && (
            <p className="text-sm text-destructive">{state.errors.companyName[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryEmail">
            Primary Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="primaryEmail"
            name="primaryEmail"
            type="email"
            placeholder="jane@acme.ai"
            required
            defaultValue={state.values?.primaryEmail}
            aria-invalid={!!state.errors?.primaryEmail}
          />
          {state.errors?.primaryEmail && (
            <p className="text-sm text-destructive">{state.errors.primaryEmail[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyDescription">
          Company Description <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          What does your company do? How does it relate to AI safety?
        </p>
        <Textarea
          id="companyDescription"
          name="companyDescription"
          placeholder="We're building..."
          required
          defaultValue={state.values?.companyDescription}
          className="min-h-[80px] sm:min-h-[120px]"
          aria-invalid={!!state.errors?.companyDescription}
        />
        {state.errors?.companyDescription && (
          <p className="text-sm text-destructive">{state.errors.companyDescription[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="founderBios">
          Founder Bios <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Tell us about the founding team&apos;s background and expertise
        </p>
        <Textarea
          id="founderBios"
          name="founderBios"
          placeholder="Jane has 10 years of experience in..."
          required
          defaultValue={state.values?.founderBios}
          className="min-h-[80px] sm:min-h-[120px]"
          aria-invalid={!!state.errors?.founderBios}
        />
        {state.errors?.founderBios && (
          <p className="text-sm text-destructive">{state.errors.founderBios[0]}</p>
        )}
      </div>

      {/* Optional Fields */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://acme.ai"
            defaultValue={state.values?.website}
            aria-invalid={!!state.errors?.website}
          />
          {state.errors?.website && (
            <p className="text-sm text-destructive">{state.errors.website[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deckLink">Pitch Deck or Documents Link</Label>
          <Input
            id="deckLink"
            name="deckLink"
            type="url"
            placeholder="https://drive.google.com/..."
            defaultValue={state.values?.deckLink}
            aria-invalid={!!state.errors?.deckLink}
          />
          {state.errors?.deckLink && (
            <p className="text-sm text-destructive">{state.errors.deckLink[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousFunding">Previous Funding / Accelerator History</Label>
        <p className="text-sm text-muted-foreground">
          Have you raised money before? Participated in any accelerators?
        </p>
        <Textarea
          id="previousFunding"
          name="previousFunding"
          placeholder="We raised a $500k pre-seed from... / We were part of Y Combinator W24..."
          defaultValue={state.values?.previousFunding}
          className="min-h-[80px] sm:min-h-[100px]"
        />
      </div>

      {/* Error Message */}
      {state.message && !state.success && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{state.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full sm:w-auto"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Request
          </>
        )}
      </Button>
    </form>
  )
}
