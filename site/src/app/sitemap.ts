import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  let projectUrls: MetadataRoute.Sitemap = [];
  if (supabase) {
    const { data } = await supabase.from('projects').select('slug');
    projectUrls = (data || []).map((p) => ({ url: `${base}/projects/${p.slug}`, changeFrequency: 'weekly', priority: 0.6 }));
  }
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/projects`, changeFrequency: 'weekly', priority: 0.7 },
    ...projectUrls,
  ];
}



