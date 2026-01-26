import { supabase } from '@/lib/supabase'
import { TeamMemberGrid } from '@/components/TeamMemberCard'
import type { TeamMember } from '@/types/database'

export const revalidate = 3600

async function getTeamMembers(): Promise<TeamMember[]> {
  const { data } = await supabase
    .from('website_team_members')
    .select('*')
    .order('sort_order')
  return (data as TeamMember[]) || []
}

export const metadata = {
  title: 'Team | SAIF',
  description: 'Meet the team behind the Safe Artificial Intelligence Fund.',
}

export default async function TeamPage() {
  const members = await getTeamMembers()

  return (
    <div className="py-24">
      <div className="container">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Our Team</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We&apos;re a team of experienced investors and entrepreneurs committed
            to building a safer future with AI.
          </p>
        </div>

        <TeamMemberGrid members={members} />
      </div>
    </div>
  )
}
