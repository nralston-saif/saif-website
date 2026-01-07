import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const secret = searchParams.get('secret')

  // Optional: Add a secret token for production security
  // if (secret !== process.env.REVALIDATION_SECRET) {
  //   return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  // }

  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 })
  }

  revalidatePath(path)
  return NextResponse.json({ revalidated: true, path })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || '/portfolio'

  revalidatePath(path)
  return NextResponse.json({ revalidated: true, path, time: new Date().toISOString() })
}
