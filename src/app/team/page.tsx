import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Linkedin, Twitter } from 'lucide-react'

export const revalidate = 3600

async function getTeamMembers() {
  const { data } = await supabase
    .from('website_team_members')
    .select('*')
    .order('sort_order')
  return data || []
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

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="mb-4 h-32 w-32 rounded-full bg-muted mx-auto" />
                <CardTitle className="text-center">{member.name}</CardTitle>
                <CardDescription className="text-center">{member.role}</CardDescription>
              </CardHeader>
              {(member.bio || member.linkedin_url || member.twitter_url) && (
                <CardContent>
                  {member.bio && (
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  )}
                  {(member.linkedin_url || member.twitter_url) && (
                    <div className="mt-4 flex justify-center gap-4">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {member.twitter_url && (
                        <a
                          href={member.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
