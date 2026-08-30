# Verification notes — 2026-08-31

The Green Cottages public website now uses `Laforet` as a single unaccented word in source copy, metadata, image alt text, and the public property/blog database content. The homepage, location page, rates page, cottage pages, and blog page rendered successfully during preview capture. The free-guide CTA is present on the homepage and the uploaded PDF asset was reachable as a six-page PDF.

The guide PDF preview showed a clean six-page professional layout with an exterior cover image, table of contents, readable section hierarchy, local-area imagery, practical planning notes, and an explicit privacy note excluding access codes, WiFi credentials, and exact arrival directions. The image batch reduced 90 referenced assets from approximately 821.68 MB to approximately 29.84 MB as optimized WebP files, preserving aspect ratio and limiting oversized images to a maximum width of 2200px.

One initial image-reachability check used an incorrect guessed filename and returned HTTP 403; the exact uploaded hero filename was then retrieved from the upload manifest and successfully served as a 2200x1238 WebP. No source references remain to JPG, JPEG, PNG, AVIF, accented Laforêt, or spaced La Forêt variants in the audited website source.

## Remaining-feature verification

The public homepage, blog route, and location route rendered successfully after the remaining-feature work. The homepage continues to show the Laforet spelling and the free-guide CTA. The location page shows the Laforet hero and the no-direct-access Semois note. The sitemap endpoint returned valid XML and includes `/blog`. TypeScript compilation and all 8 Vitest tests passed after the admin operations, house-rules schema, guest communication, booking editing, occupancy display, and dynamic sitemap changes.

The admin dashboard now includes an Operations panel with editable property descriptions and house rules, draft/edit/publish blog controls, gallery URL management, property creation, booking detail editing, guest contact and communication-history records, and analytics including occupancy percentage. Existing booking status controls remain in the Bookings tab.

## Bathroom and gallery-order verification
The live `property_photos` records contain 10 House 1 bathroom images for property 2 / Le Sève at display orders 16–25, and 7 House 2 bathroom images for property 3 / Le Bois at display orders 17–23. The public cottage query orders all photos by `displayOrder` and `id`, and the cottage pages prefer those database-backed URLs. Screenshot counters show the persisted galleries loading with 26 images for Le Sève and 24 images for Le Bois. Admin up/down controls call the protected reorder procedure, which swaps adjacent `displayOrder` values and invalidates the gallery query.
