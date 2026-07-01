# Sève & Bois Escapes — Project TODO

## Phase 2: Database, Stripe, Dependencies
- [x] Install Stripe, node-ical, nodemailer, ical-generator packages
- [x] Define DB schema: cottages, bookings, ical_feeds, newsletter_subscribers, enquiries
- [x] Run DB migration
- [x] Add Stripe secret key via webdev_request_secrets (auto-configured)
- [ ] Add email/SMTP secret via webdev_request_secrets (deferred until domain purchase)

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
- [ ] iCal import (fetch + parse external .ics URLs to block dates) — optional enhancement
- [ ] Admin: manage iCal feed URLs per cottage — optional enhancement
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
- [ ] iCal import (external .ics URL blocking)
- [ ] Admin iCal feed management UI
- [ ] Blog post editor UI
- [ ] Blog search and category filtering
- [ ] Blog posts sitemap integration


## Phase 10: Admin Dashboard & Property Management
- [ ] Restructure booking model: both cottages as single unit (max 12 guests)
- [ ] Update database schema: change from per-cottage bookings to single property bookings
- [ ] Create admin login page with role-based access control
- [ ] Build admin dashboard layout (sidebar, property overview)
- [ ] Property management: edit amenities (kids gear, baby gear, etc.)
- [ ] Property management: edit pricing and seasonal rates
- [ ] Property management: edit descriptions and house rules
- [ ] Property management: calendar management and availability
- [ ] Property management: iCal feed management (export + import)
- [ ] Property management: photo gallery management (upload, reorder, delete)
- [ ] Property management: add new property functionality
- [ ] Admin booking management: view, edit, cancel bookings
- [ ] Admin guest management: view guest details, communication history
- [ ] Admin analytics: booking stats, revenue, occupancy
- [ ] Update booking flow to reflect single-unit model (both cottages together)
- [ ] Update rates page to show single-unit pricing
- [ ] Update cottage detail pages to show they're rented together
- [ ] Test admin workflows end-to-end
