import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qmlpslmeiunymhnolhmi.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_htNKa7HnkRROgsLDlfF00Q_Ip16FT64'
)

async function testId() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brands ( name ),
      categories ( name ),
      product_images ( url, is_primary, display_order )
    `)
    .eq('id', '8241fbce-df78-4410-ab88-1f26d95d6e8c')

  console.log('Error:', error)
  console.log('Product:', JSON.stringify(data, null, 2))
}

testId()
