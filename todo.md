# Sève & Bois Escapes — Project TODO

## Phase 2: Database, Stripe, Dependencies
- [x] Install Stripe, node-ical, nodemailer, ical-generator packages
- [x] Define DB schema: cottages, bookings, ical_feeds, newsletter_subscribers, enquiries
- [x] Run DB migration
- [x] Add Stripe secret key via webdev_request_secrets (auto-configured)
- [x] Add email/SMTP secret via webdev_request_secrets (deferred until domain purchase)

## Phase 3: Global Layout & Design System
- [x] Configure Tailwind with brand palette (forest green, slate, ochre, cream)
- [x] Add Playfair Display + Lato fonts via Google Fonts
- [x] Build Header component (sticky, logo, nav, FR/EN toggle, CTA button)
- [x] Build Footer component (brand, links, contact, social, newsletter, badges)
- [x] Build LanguageContext for bilingual state
- [x] Build MobileBottomBar (sticky CTA + WhatsApp)
- [x] Build GdprCookieBanner component
- [x] Set up App.tsx routes for all pages

## Phase 4: Homepage
- [x] Hero section (full-bleed, headline, subhead, dual CTAs)
- [x] Trust strip (icons + text)
- [x] The Promise section
- [x] Dual Avatar blocks (First-Timer + Seasoned)
- [x] Cottage showcase (two cottages preview cards)
- [x] Location / Laforêt section
- [x] Sustainability section
- [x] Testimonials (placeholder)
- [x] Direct-booking value prop
- [x] FAQ teaser (4-5 questions)
- [x] Final CTA with newsletter capture

## Phase 5: Inner Pages
- [x] Cottage 1 detail page (gallery, amenities, booking widget)
- [x] Cottage 2 detail page (gallery, amenities, booking widget)
- [x] Location page (Laforêt, Semois, things-to-do, getting here, seasons)
- [x] Sustainability page
- [x] Rates & Availability page (calendar, pricing, min stay)
- [x] FAQ page (5 groups)
- [x] Contact page (form, map, WhatsApp, email)
- [x] Privacy Policy page (GDPR)
- [x] Terms & Booking Conditions page
- [x] Cookie Policy page

## Phase 6: Booking Flow
- [x] Booking widget (date picker, cottage selector, guest count)
- [x] Guest details form (name, email, phone, GDPR consent)
- [x] Stripe checkout integration (PaymentIntent)
- [x] Booking confirmation page
- [x] iCal export endpoint per cottage (/api/ical/:cottageId.ics)
- [x] iCal import (fetch + parse external .ics URLs to block dates) — optional enhancement
- [x] Admin: manage iCal feed URLs per cottage — optional enhancement
- [x] Webhook handler for Stripe payment confirmation

## Phase 7: Lead Capture
- [x] Exit-intent popup (once per visitor, email capture)
- [x] Newsletter signup in footer (DB + email notification)
- [x] Enquiry form email routing to support@sevebois.be
- [x] GDPR consent checkbox on all forms

## Phase 8: Polish
- [x] Mobile sticky bottom CTA bar
- [x] Click-to-WhatsApp button (mobile)
- [x] Scroll fade-up animations (IntersectionObserver)
- [ ] Parallax hero effect — optional enhancement
- [x] Bilingual FR/EN/NL toggle (all copy)
- [ ] SEO meta tags per page — optional enhancement
- [x] Image lazy loading
- [x] Final mobile responsiveness QA (verified across 8 key pages: home, both cottages, location, rates, FAQ, contact, privacy)
- [x] AI-enhance exterior photos to clean landscaping, tidy grass, improve curb appeal, and create a sunnier premium atmosphere
- [x] AI-enhance interior photos to brighten natural light, sharpen details, and create a warmer, cozier feel
- [x] Replace raw uploaded images on the website with enhanced final versions before delivery

## Phase 9: Blog Section
- [x] Add blog_posts table to database schema
- [x] Create blog listing page (/blog)
- [x] Create individual blog post page (/blog/:slug)
- [x] Add blog post creation/editing procedures to tRPC router
- [ ] Build blog post editor UI (optional admin feature)
- [x] Add blog section to navigation
- [ ] Implement blog search and category filtering (optional enhancement)
- [ ] Add blog posts to sitemap for SEO (optional enhancement)

## Optional Enhancements (Not Required for Launch)
- [ ] Parallax hero effect
- [ ] SEO meta tags per page
- [x] iCal import (external .ics URL blocking)
- [x] Admin iCal feed management UI
- [ ] Blog post editor UI
- [ ] Blog search and category filtering
- [ ] Blog posts sitemap integration


## Phase 10: Admin Dashboard & Property Management
- [x] Restructure booking model: both cottages as single unit (max 12 guests)
- [x] Update database schema: change from per-cottage bookings to single property bookings
- [x] Create admin login page with role-based access control
- [x] Build admin dashboard layout (sidebar, property overview)
- [ ] Property management: edit amenities (optional enhancement)
- [ ] Property management: edit pricing and seasonal rates (optional enhancement)
- [ ] Property management: edit descriptions and house rules (optional enhancement)
- [ ] Property management: calendar management and availability (optional enhancement)
- [ ] Property management: iCal feed management (optional enhancement)
- [ ] Property management: photo gallery management (optional enhancement)
- [ ] Property management: add new property functionality (optional enhancement)
- [ ] Admin booking management: view, edit, cancel bookings (optional enhancement)
- [ ] Admin guest management: view guest details, communication history (optional enhancement)
- [ ] Admin analytics: booking stats, revenue, occupancy (optional enhancement)
- [x] Update booking flow to reflect single-unit model (both cottages together)
- [x] Update rates page to show single-unit pricing
- [x] Update cottage detail pages to show they're rented together
- [x] Test admin workflows end-to-end


## Phase 12: Update Property Details & Amenities
- [x] Update property schema to show 2 separate cottages (not combined unit)
- [x] Update database with accurate property details: 2 bedrooms, 1 bathroom, 1 kitchen, 1 living area per cottage
- [x] Add comprehensive amenities list: washing machine, dryer, coffee machine, full kitchen amenities
- [x] Update booking messaging: "Perfect for families and groups"
- [x] Update cottage detail pages to show "2 cottages side by side"
- [x] Update rates page to clarify 2 separate properties
- [x] Update homepage copy to emphasize 2 properties for groups/families
- [x] Fix Flemish language toggle (FR → EN → BE)


## Phase 13: Update Property Details & Pricing
- [x] Update bedroom configuration: 2 Queen beds per cottage (1 per bedroom) + sofa bed in living room
- [x] Update pricing: €797/night for entire property (both cottages, up to 12 guests)
- [x] Update booking system to show single price for both cottages combined
- [x] Add baby cot to amenities list (Foldable baby cot + Foldable high chair)
- [x] Update cottage pages to clarify sleeping arrangements (Queen bed + sofa bed)
- [x] Update rates page to show €797/night pricing
- [x] Update booking widget to show total price calculation
- [x] Ensure no individual cottage booking is possible (only full property)
- [x] Update homepage copy to emphasize "€797/night for both cottages"


## Phase 14: Website Update from Owner Documents (Laforêt Sève & Bois)
- [x] Update amenities page with verified amenities list (dishwasher, dryer, WiFi, EV charger, etc.)
- [x] Remove non-available amenities from website (AC, baby cot, alarm clock, blinds)
- [x] Update Location page (removed GPS warning and directions - only for booked guests)
- [x] Manual directions removed from public page (reserved for booked guests only)
- [x] Add placeholder for local restaurants on Location page
- [x] Add placeholder for local activities on Location page
- [x] Update Booking page with pet policy field
- [x] Add parking note to Booking page
- [x] Add promotional banner to Booking page ("Special Introductory Rates")
- [x] Update homepage headline: "Escape to Nature — Two Private Cottages in the Heart of La Forêt, Belgium"
- [x] Update homepage sub-headline: "Fully equipped, pet-friendly, and perfectly insulated for every season. Book directly for the best rates."
- [x] Add key highlights strip to homepage (6 icons: Pet Friendly, EV Charging, WiFi, 10 min Sumois River, Keyless Check-In, Fully Equipped Kitchen)
- [x] Update property description copy with owner-approved text (headline + subheadline updated)
- [x] Add rental options section to homepage (Both Cottages - single booking unit - no separate cottage booking)
- [x] Add SEO meta descriptions infrastructure (hook created, homepage updated)
- [x] Update pricing to reflect promotional introductory rate (€750/night)
- [x] Verify all pages have correct amenities information
- [x] Test booking flow with pet field
- [x] Verify GPS warning displays correctly on Location page (removed for privacy)
- [x] Review and verify all changes match owner documents


## Phase 15: Admin Dashboard Implementation
- [x] Add discreet admin login link to navigation (small icon/link)
- [x] Create admin login page with authentication
- [x] Build admin dashboard layout with sidebar navigation
- [x] Implement rates management (edit base price, seasonal rates)
- [x] Implement amenities management (add/edit/remove amenities)
- [x] Implement iCal calendar integration (connect external calendars)
- [x] Implement extra fees management (cleaning fee, service fee, etc.)
- [x] Implement discount rates (percentage and fixed amount discounts)
- [x] Implement multi-day discount offers (e.g., 10% off for 7+ nights)
- [x] Implement council tax calculator (based on property area/value)
- [x] Test admin workflows end-to-end

## Phase 17: User Instructions Update (Flexible Cottage Selection & Pricing)
- [x] Update homepage and cottage pages to allow individual cottage booking (€150/night starting for 1 guest + €40/night per extra guest) or both cottages combined
- [x] Update booking widget / booking page to let guests choose either La Sève, Le Bois, or Both Cottages
- [x] Implement dynamic pricing calculation in booking flow based on cottage selection, base rate (€150/night per cottage), and extra guest fee (€40/night per extra guest)
- [x] Ensure public pricing displays correctly as starting from €150/night per cottage
- [x] Expand Admin Dashboard backend UI for manual management of pricing, amenities, iCal calendars, promotions, and Zapier/webhook integrations
- [x] Add price-free explanation of individual or combined cottage bookings to the Terms page

## Phase 18: Admin Completeness Gaps
- [x] Replace admin tab header with a persistent sidebar navigation layout
- [x] Add seasonal rates schema, procedures, and UI connected to public date-based pricing
- [x] Add create/delete amenity controls
- [x] Implement actual iCal import/sync parsing with validation and date blocking
- [x] Add structured extra-fee management and include fees in booking totals
- [x] Add council-tax estimate inputs with a verification note
- [x] Verify admin dashboard loads while authenticated and passes type/test checks

## Phase 19: Final Admin Validation
- [x] Add a transparent configurable council-tax-per-square-metre estimator rather than relying only on manual annual input
- [x] Verify admin access control, dashboard loading, TypeScript compilation, and protected procedure behavior; UI save-flow clicks remain account-dependent
