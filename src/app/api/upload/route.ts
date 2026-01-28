import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { join } from 'path'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const filename = uniqueSuffix + '-' + file.name.replace(/\s+/g, '-').toLowerCase()

        // Ensure directory exists
        const uploadDir = join(process.cwd(), 'public/uploads/products')
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (error) {
            // Ignore error if exists
        }

        const filePath = join(uploadDir, filename)
        await writeFile(filePath, buffer)

        const url = `/uploads/products/${filename}`

        return NextResponse.json({ url })

    } catch (error) {
        console.error('Upload Error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
