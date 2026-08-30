# Verification notes — 2026-08-31

The Green Cottages public website now uses `Laforet` as a single unaccented word in source copy, metadata, image alt text, and the public property/blog database content. The homepage, location page, rates page, cottage pages, and blog page rendered successfully during preview capture. The free-guide CTA is present on the homepage and the uploaded PDF asset was reachable as a six-page PDF.

The guide PDF preview showed a clean six-page professional layout with an exterior cover image, table of contents, readable section hierarchy, local-area imagery, practical planning notes, and an explicit privacy note excluding access codes, WiFi credentials, and exact arrival directions. The image batch reduced 90 referenced assets from approximately 821.68 MB to approximately 29.84 MB as optimized WebP files, preserving aspect ratio and limiting oversized images to a maximum width of 2200px.

One initial image-reachability check used an incorrect guessed filename and returned HTTP 403; the exact uploaded hero filename was then retrieved from the upload manifest and successfully served as a 2200x1238 WebP. No source references remain to JPG, JPEG, PNG, AVIF, accented Laforêt, or spaced La Forêt variants in the audited website source.
