import { notFound } from 'next/navigation';
import db from '@/lib/db';
import ClientSiteView from './ClientSiteView';

// Revalidate or Edge config could be used here, keeping simple standard Server Component
// The prompt doesn't specify using the edge runtime or static static generation, just SSR.

export default async function InstituteSitePage({ params }: { params: { slug: string } }) {
    // Fetch institute site data using slug
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    const query = `
        SELECT * FROM institute_sites
        WHERE slug = $1
    `;
    
    let result;
    try {
        console.log('Fetching slug:', slug);
        result = await db.query(query, [slug]);
        console.log('Result:', result.rows);
    } catch (e) {
        console.error("Failed to load institute data", e);
        return notFound();
    }
    
    if (!result || result.rows.length === 0) {
        notFound();
    }
    
    const instituteData = result.rows[0];
    
    // Pass raw data. Postgres returns raw strings for JSON if pg isn't set up optimally in some cases, 
    // but the ClientSiteView handles mapping directly over objects if it's parsed.
    // Let's ensure JSON fields are parsed if they come as strings
    if (typeof instituteData.courses === 'string') instituteData.courses = JSON.parse(instituteData.courses);
    if (typeof instituteData.results === 'string') instituteData.results = JSON.parse(instituteData.results);
    if (typeof instituteData.testimonials === 'string') instituteData.testimonials = JSON.parse(instituteData.testimonials);
    if (typeof instituteData.faculty === 'string') instituteData.faculty = JSON.parse(instituteData.faculty);
    
    return <ClientSiteView data={instituteData} />;
}
