'use server'

import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function normalizeWebsite(url: string | null): string | null {
  if (!url) return null
  try {
    return url
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
  } catch {
    return url.toLowerCase().trim()
  }
}

async function createFoundersForCompany(
  companyId: string,
  founderNames: string,
  founderLinkedins: string,
  primaryEmail: string
): Promise<void> {
  const names = founderNames.split('\n').map((n) => n.trim()).filter(Boolean)
  const linkedins = founderLinkedins.split('\n').map((l) => l.trim()).filter(Boolean)

  for (let i = 0; i < names.length; i++) {
    const fullName = names[i]
    const linkedin = linkedins[i] || null
    const email = i === 0 ? primaryEmail : null

    // Split into first/last name
    const nameParts = fullName.split(/\s+/)
    const firstName = nameParts[0] || fullName
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null

    let personId: string | null = null

    // Check for existing person by email first
    if (email) {
      const { data: existingByEmail } = await supabase
        .from('saif_people')
        .select('id')
        .eq('email', email)
        .limit(1)
        .single()

      if (existingByEmail) {
        personId = existingByEmail.id
      }
    }

    // Check for existing person by LinkedIn URL
    if (!personId && linkedin) {
      const { data: existingByLinkedin } = await supabase
        .from('saif_people')
        .select('id')
        .eq('linkedin_url', linkedin)
        .limit(1)
        .single()

      if (existingByLinkedin) {
        personId = existingByLinkedin.id
      }
    }

    // Create new person if not found
    if (!personId) {
      const { data: newPerson, error: personError } = await supabase
        .from('saif_people')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          linkedin_url: linkedin,
          role: 'founder',
          status: 'tracked',
        })
        .select('id')
        .single()

      if (personError) {
        console.error(`Error creating person ${fullName}:`, personError)
        continue
      }
      personId = newPerson.id
    }

    // Check if this person is already linked to this company
    const { data: existingLink } = await supabase
      .from('saif_company_people')
      .select('id')
      .eq('company_id', companyId)
      .eq('user_id', personId)
      .limit(1)
      .single()

    if (existingLink) {
      console.log(`Person ${fullName} already linked to company ${companyId}`)
      continue
    }

    // Link person to company
    const { error: linkError } = await supabase
      .from('saif_company_people')
      .insert({
        company_id: companyId,
        user_id: personId,
        relationship_type: 'founder',
        is_primary_contact: i === 0,
      })

    if (linkError) {
      console.error(`Error linking ${fullName} to company:`, linkError)
    } else {
      console.log(`Linked founder ${fullName} to company ${companyId}`)
    }
  }
}

async function findOrCreateCompany(
  companyName: string,
  website: string | null,
  description: string | null
): Promise<string> {
  const normalizedWebsite = normalizeWebsite(website)

  // 1. Search by name (case-insensitive)
  const { data: existingByName } = await supabase
    .from('saif_companies')
    .select('id')
    .ilike('name', companyName)
    .limit(1)
    .single()

  if (existingByName) {
    console.log(`Found existing company by name: ${companyName} (${existingByName.id})`)
    return existingByName.id
  }

  // 2. Search by normalized website URL
  if (normalizedWebsite) {
    const { data: existingByWebsite } = await supabase
      .from('saif_companies')
      .select('id')
      .ilike('website', `%${normalizedWebsite}%`)
      .limit(1)
      .single()

    if (existingByWebsite) {
      console.log(`Found existing company by website: ${website} (${existingByWebsite.id})`)
      return existingByWebsite.id
    }
  }

  // 3. Create new company
  const { data: newCompany, error } = await supabase
    .from('saif_companies')
    .insert({
      name: companyName,
      website: website,
      short_description: description,
      stage: 'prospect',
      is_active: true,
      is_aisafety_company: false,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating company:', error)
    throw new Error(`Failed to create company: ${error.message}`)
  }

  console.log(`Created new prospect company: ${companyName} (${newCompany.id})`)
  return newCompany.id
}

const formSchema = z.object({
  founderNames: z.string().min(1, 'At least one founder name is required'),
  founderLinkedins: z.string().min(1, 'At least one LinkedIn URL is required'),
  companyName: z.string().min(1, 'Company name is required'),
  companyDescription: z.string().min(10, 'Please provide a description of at least 10 characters'),
  website: z.string().url().optional().or(z.literal('')),
  primaryEmail: z.string().email('Please enter a valid email address'),
  previousFunding: z.string().optional(),
  founderBios: z.string().min(10, 'Please provide founder bios of at least 10 characters'),
  deckLink: z.string().url().optional().or(z.literal('')),
  honeypot: z.string().max(0, 'Bot detected'), // Spam protection
})

export type FormState = {
  success: boolean
  message: string
  submissionId?: string
  errors?: Record<string, string[]>
  values?: {
    companyName?: string
    companyDescription?: string
    website?: string
    primaryEmail?: string
    previousFunding?: string
    founderBios?: string
    deckLink?: string
  }
}

export async function submitFundingRequest(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Check honeypot field (spam protection)
  const honeypot = formData.get('website_url') as string
  if (honeypot) {
    // Bot detected, silently fail
    return {
      success: true,
      message: 'Thank you for your submission!',
    }
  }

  const rawData = {
    founderNames: formData.get('founderNames') as string,
    founderLinkedins: formData.get('founderLinkedins') as string,
    companyName: formData.get('companyName') as string,
    companyDescription: formData.get('companyDescription') as string,
    website: formData.get('website') as string,
    primaryEmail: formData.get('primaryEmail') as string,
    previousFunding: formData.get('previousFunding') as string,
    founderBios: formData.get('founderBios') as string,
    deckLink: formData.get('deckLink') as string,
    honeypot: '',
  }

  // Validate the data
  const validationResult = formSchema.safeParse(rawData)

  if (!validationResult.success) {
    const errors: Record<string, string[]> = {}
    validationResult.error.issues.forEach((issue) => {
      const path = issue.path[0] as string
      if (!errors[path]) {
        errors[path] = []
      }
      errors[path].push(issue.message)
    })

    return {
      success: false,
      message: 'Please fix the errors below.',
      errors,
      values: {
        companyName: rawData.companyName,
        companyDescription: rawData.companyDescription,
        website: rawData.website,
        primaryEmail: rawData.primaryEmail,
        previousFunding: rawData.previousFunding,
        founderBios: rawData.founderBios,
        deckLink: rawData.deckLink,
      },
    }
  }

  const data = validationResult.data

  // Generate a submission ID
  const submissionId = `SAIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  try {
    // Find or create a company record
    let companyId: string | null = null
    try {
      companyId = await findOrCreateCompany(
        data.companyName,
        data.website || null,
        data.companyDescription
      )
    } catch (err) {
      console.error('Failed to find/create company, proceeding without company_id:', err)
    }

    const { data: application, error } = await supabase
      .from('saifcrm_applications')
      .insert({
        submission_id: submissionId,
        company_name: data.companyName,
        company_id: companyId,
        founder_names: data.founderNames,
        founder_linkedins: data.founderLinkedins,
        founder_bios: data.founderBios,
        primary_email: data.primaryEmail,
        company_description: data.companyDescription,
        website: data.website || null,
        previous_funding: data.previousFunding || null,
        deck_link: data.deckLink || null,
        stage: 'new',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        message: 'There was an error submitting your application. Please try again.',
      }
    }

    // Create founder people records and link them to the company
    if (companyId && data.founderNames) {
      try {
        await createFoundersForCompany(
          companyId,
          data.founderNames,
          data.founderLinkedins,
          data.primaryEmail
        )
      } catch (err) {
        console.error('Failed to create founder records:', err)
        // Don't fail the submission if founder creation fails
      }
    }

    return {
      success: true,
      message: 'Your application has been submitted successfully!',
      submissionId,
    }
  } catch (error) {
    console.error('Submission error:', error)
    return {
      success: false,
      message: 'There was an error submitting your application. Please try again.',
    }
  }
}
