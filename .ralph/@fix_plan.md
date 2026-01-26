# Ralph Fix Plan - SAIF Website

## Priority 1 - UI/UX Changes (Do First)

- [ ] Team page accordion - show photo/name/title by default, hide bio until card is clicked. Accordion behavior: when one card expands, others collapse. Keep social links visible.
- [ ] Remove hello@saif.vc - delete from Footer.tsx and search for any other occurrences
- [ ] Remove stats banner from home page - delete the entire "0 portfolio companies / 11 investment themes / $100K initial investment" section (lines 88-121 in src/app/page.tsx)
- [ ] Move "What We Do" section up - position directly after the hero section on home page
- [ ] Reduce whitespace on home page - decrease py-24 padding to py-12 or py-16, tighten spacing between sections to show more content
- [ ] Make UI less AI-y - softer shadows, warmer feel, more organic design, less corporate/template look. Consider subtle gradients, softer border-radius, warmer grays.

## Priority 2 - Functional Improvements

- [ ] Add email notifications for funding requests - integrate Resend or similar to notify team when founders submit applications via the request form

## Priority 3 - Polish & Performance

- [ ] Extract reusable PortfolioCard component - currently duplicated in home page and portfolio page
- [ ] Implement next/image optimization - replace raw img tags with Next.js Image component
- [ ] Add search/filtering to portfolio page - allow filtering by investment theme
- [ ] Add search/filtering to blog page - allow filtering or search by title

## Completed

- [x] Project enabled for Ralph
- [x] Initial codebase review and task planning
- [x] Fix mobile navigation menu
- [x] Create 404 page
- [x] Create error boundary
- [x] Security fix for revalidate API

## Notes

- Site is built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Supabase
- Team data comes from website_team_members table
- Focus on Priority 1 tasks first - these are the owner's direct requests
- Make commits after completing each task
