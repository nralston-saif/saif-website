'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Linkedin, Twitter, ChevronDown } from 'lucide-react'
import type { TeamMember } from '@/types/database'

type TeamMemberCardProps = {
  member: TeamMember
  isExpanded: boolean
  onToggle: () => void
}

export function TeamMemberCard({ member, isExpanded, onToggle }: TeamMemberCardProps) {
  const hasBio = !!member.bio
  const hasLinks = !!(member.linkedin_url || member.twitter_url)

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${hasBio ? 'hover:shadow-md' : ''}`}
      onClick={hasBio ? onToggle : undefined}
    >
      <CardHeader>
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            className="mb-4 h-32 w-32 rounded-full object-cover mx-auto"
          />
        ) : (
          <div className="mb-4 h-32 w-32 rounded-full bg-muted mx-auto" />
        )}
        <CardTitle className="text-center">{member.name}</CardTitle>
        <CardDescription className="text-center">{member.role}</CardDescription>

        {/* Social links - always visible */}
        {hasLinks && (
          <div className="mt-4 flex justify-center gap-4">
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        )}

        {/* Expand indicator */}
        {hasBio && (
          <div className="flex justify-center mt-2">
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        )}
      </CardHeader>

      {/* Bio - collapsible */}
      {hasBio && (
        <div
          className={`overflow-hidden transition-all duration-200 ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{member.bio}</p>
          </CardContent>
        </div>
      )}
    </Card>
  )
}

type TeamMemberGridProps = {
  members: TeamMember[]
}

export function TeamMemberGrid({ members }: TeamMemberGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <TeamMemberCard
          key={member.id}
          member={member}
          isExpanded={expandedId === member.id}
          onToggle={() => handleToggle(member.id)}
        />
      ))}
    </div>
  )
}
