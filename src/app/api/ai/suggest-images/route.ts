import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Free Unsplash API - no auth required for basic search
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const accessKey = process.env.UNSPLASH_ACCESS_KEY;

        // If no Unsplash key, return empty (graceful degradation)
        if (!accessKey) {
            return NextResponse.json({ images: [] });
        }

        const response = await fetch(
            `${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`,
            {
                headers: {
                    'Authorization': `Client-ID ${accessKey}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from Unsplash');
        }

        const data = await response.json();

        const images = data.results.map((img: any) => ({
            id: img.id,
            url: img.urls.regular,
            thumb: img.urls.small,
            alt: img.alt_description || query,
            photographer: img.user.name,
            photographerUrl: img.user.links.html,
        }));

        return NextResponse.json({ images });
    } catch (error: any) {
        console.error('Unsplash search error:', error);
        return NextResponse.json({ images: [] }); // Graceful fallback
    }
}
