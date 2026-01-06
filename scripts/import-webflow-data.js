const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Parse CSV (handles quoted fields with commas)
function parseCSV(content) {
  const lines = content.trim().split('\n')
  const headers = parseCSVLine(lines[0])
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const obj = {}
    headers.forEach((h, i) => obj[h] = values[i] || '')
    return obj
  })
}

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

async function importData() {
  const exportsDir = path.join(__dirname, '../webflow_exports')

  // 1. Clear existing data
  console.log('Clearing existing data...')
  await supabase.from('website_blog_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('website_portfolio_companies').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('website_team_members').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // 2. Import Team Members
  console.log('\nImporting team members...')
  const teamCSV = fs.readFileSync(path.join(exportsDir, 'SAIF - Team.csv'), 'utf-8')
  const teamData = parseCSV(teamCSV)

  const teamMembers = teamData.map((row, index) => ({
    name: row.Name,
    role: row.Title,
    bio: row.Description,
    photo_url: row.Photo,
    sort_order: parseInt(row.Order) || index + 1
  }))

  const { data: insertedTeam, error: teamError } = await supabase
    .from('website_team_members')
    .insert(teamMembers)
    .select()

  if (teamError) console.error('Team error:', teamError)
  else console.log(`  Imported ${insertedTeam.length} team members`)

  // Create author lookup map
  const authorMap = {}
  if (insertedTeam) {
    insertedTeam.forEach(member => {
      authorMap[member.name.toLowerCase()] = member.id
    })
  }

  // 3. Import Portfolio Companies
  console.log('\nImporting portfolio companies...')
  const startupsCSV = fs.readFileSync(path.join(exportsDir, 'SAIF - Startups.csv'), 'utf-8')
  const startupsData = parseCSV(startupsCSV)

  // Filter out drafts
  const publishedStartups = startupsData.filter(row => row.Draft !== 'true')

  const companies = publishedStartups.map((row, index) => ({
    name: row.Name,
    tagline: row.Description,
    logo_url: row.Logo,
    website_url: row.website || null,
    featured: parseInt(row.Order) <= 6,
    sort_order: parseInt(row.Order) || index + 1
  }))

  const { data: insertedCompanies, error: companiesError } = await supabase
    .from('website_portfolio_companies')
    .insert(companies)
    .select()

  if (companiesError) console.error('Companies error:', companiesError)
  else console.log(`  Imported ${insertedCompanies.length} portfolio companies`)

  // 4. Import Blog Posts
  console.log('\nImporting blog posts...')
  const blogCSV = fs.readFileSync(path.join(exportsDir, 'SAIF - News_Blogs.csv'), 'utf-8')
  const blogData = parseCSV(blogCSV)

  const blogPosts = blogData.map(row => {
    // Determine if this is external press or internal blog
    const authorName = row.Author?.toLowerCase() || ''
    const isInternal = authorName.includes('ralston')
    const isPress = !isInternal || authorName === 'techcrunch' || authorName === 'maginative'

    return {
      title: row.Name,
      slug: row.Slug,
      excerpt: row['Post Summary'],
      source: isPress ? row.Author : null,
      source_url: row.Website,
      author_id: isInternal ? authorMap[authorName] || null : null,
      published: true,
      published_at: row['Date Published'] ? new Date(row['Date Published']).toISOString() : new Date().toISOString()
    }
  })

  const { data: insertedPosts, error: postsError } = await supabase
    .from('website_blog_posts')
    .insert(blogPosts)
    .select()

  if (postsError) console.error('Posts error:', postsError)
  else console.log(`  Imported ${insertedPosts.length} blog posts`)

  console.log('\nImport complete!')
}

importData().catch(console.error)
