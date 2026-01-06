const { createClient } = require('@supabase/supabase-js')
const https = require('https')
const path = require('path')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

// Download image from URL and return buffer
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        return downloadImage(response.headers.location).then(resolve).catch(reject)
      }

      const chunks = []
      response.on('data', chunk => chunks.push(chunk))
      response.on('end', () => resolve(Buffer.concat(chunks)))
      response.on('error', reject)
    }).on('error', reject)
  })
}

// Get content type from URL
function getContentType(url) {
  const ext = path.extname(url.split('?')[0]).toLowerCase()
  const types = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  }
  return types[ext] || 'image/png'
}

// Generate clean filename from URL
function getFilename(url, prefix, name) {
  const ext = path.extname(url.split('?')[0]).toLowerCase() || '.png'
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `${prefix}/${cleanName}${ext}`
}

async function migrateImages() {
  console.log('Starting image migration to Supabase Storage...\n')

  // 1. Migrate team photos
  console.log('Migrating team photos...')
  const { data: teamMembers } = await supabase
    .from('website_team_members')
    .select('id, name, photo_url')
    .not('photo_url', 'is', null)

  for (const member of teamMembers || []) {
    if (!member.photo_url || !member.photo_url.includes('website-files.com')) continue

    try {
      console.log(`  Downloading: ${member.name}`)
      const imageData = await downloadImage(member.photo_url)
      const filename = getFilename(member.photo_url, 'team', member.name)
      const contentType = getContentType(member.photo_url)

      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(filename, imageData, { contentType, upsert: true })

      if (uploadError) throw uploadError

      const newUrl = `${SUPABASE_URL}/storage/v1/object/public/website-images/${filename}`

      await supabase
        .from('website_team_members')
        .update({ photo_url: newUrl })
        .eq('id', member.id)

      console.log(`  ✓ Uploaded: ${filename}`)
    } catch (err) {
      console.error(`  ✗ Failed: ${member.name}`, err.message)
    }
  }

  // 2. Migrate company logos
  console.log('\nMigrating company logos...')
  const { data: companies } = await supabase
    .from('website_portfolio_companies')
    .select('id, name, logo_url')
    .not('logo_url', 'is', null)

  for (const company of companies || []) {
    if (!company.logo_url || !company.logo_url.includes('website-files.com')) continue

    try {
      console.log(`  Downloading: ${company.name}`)
      const imageData = await downloadImage(company.logo_url)
      const filename = getFilename(company.logo_url, 'logos', company.name)
      const contentType = getContentType(company.logo_url)

      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(filename, imageData, { contentType, upsert: true })

      if (uploadError) throw uploadError

      const newUrl = `${SUPABASE_URL}/storage/v1/object/public/website-images/${filename}`

      await supabase
        .from('website_portfolio_companies')
        .update({ logo_url: newUrl })
        .eq('id', company.id)

      console.log(`  ✓ Uploaded: ${filename}`)
    } catch (err) {
      console.error(`  ✗ Failed: ${company.name}`, err.message)
    }
  }

  console.log('\nMigration complete!')
}

migrateImages().catch(console.error)
