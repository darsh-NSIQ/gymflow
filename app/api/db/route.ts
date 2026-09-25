import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'gymflow_db.json')

function ensureDbFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      members: [],
      memberships: [],
      payments: [],
      attendance: [],
      expenses: [],
      workouts: [],
      diets: [],
      updated_at: new Date().toISOString()
    }, null, 2))
  }
}

export async function GET() {
  try {
    ensureDbFile()
    const content = fs.readFileSync(DB_FILE, 'utf-8')
    const data = JSON.parse(content)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureDbFile()
    const body = await req.json()
    const existing = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) : {}

    const updated = {
      ...existing,
      ...body,
      updated_at: new Date().toISOString()
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8')
    return NextResponse.json({ success: true, message: 'Local disk database updated successfully!' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
