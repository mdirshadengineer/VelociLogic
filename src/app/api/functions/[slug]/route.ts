export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  // Use the slug to fetch data or perform actions
  return new Response(`Function: ${slug}`);
}