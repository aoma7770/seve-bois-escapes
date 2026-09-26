import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CalendarDays, CheckCircle2, CreditCard, Mail, MessageSquare, Phone, RefreshCcw, Save, Search, UserRound, XCircle } from "lucide-react";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";
type BookingSelection = "la-seve" | "le-bois" | "both";
type BookingDraft = {
  bookingSelection: BookingSelection;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  cleaningFee: string;
  specialRequests: string;
};

type CommunicationDraft = { channel: "note" | "email" | "phone"; summary: string };

const emptyDraft: BookingDraft = {
  bookingSelection: "both",
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  guestCount: "1",
  checkIn: "",
  checkOut: "",
  totalAmount: "0",
  cleaningFee: "0",
  specialRequests: "",
};

function dateValue(value: unknown) {
  return String(value ?? "").slice(0, 10);
}

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  return Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
}

function selectionLabel(selection: string) {
  if (selection === "both") return "Both cottages";
  if (selection === "la-seve") return "La Sève";
  return "Le Bois";
}

function statusClass(status: BookingStatus) {
  if (status === "confirmed") return "bg-emerald-100 text-emerald-800";
  if (status === "cancelled" || status === "refunded") return "bg-rose-100 text-rose-800";
  return "bg-amber-100 text-amber-800";
}

export default function AdminBookingWorkspace() {
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [communication, setCommunication] = useState<CommunicationDraft>({ channel: "note", summary: "" });
  const [message, setMessage] = useState("");
  const utils = trpc.useUtils();
  const bookings = trpc.admin.getBookings.useQuery();
  const profile = trpc.admin.getBookingProfile.useQuery({ bookingId: selectedBookingId ?? 0 }, { enabled: Boolean(selectedBookingId) });

  const updateBooking = trpc.admin.updateBooking.useMutation({
    onSuccess: async () => {
      setMessage("Booking details saved.");
      await Promise.all([utils.admin.getBookings.invalidate(), utils.admin.getBookingProfile.invalidate()]);
    },
    onError: (error) => setMessage(error.message),
  });
  const updateStatus = trpc.admin.updateBookingStatus.useMutation({
    onSuccess: async (_, variables) => {
      setMessage(`Booking marked ${variables.status}.`);
      await Promise.all([utils.admin.getBookings.invalidate(), utils.admin.getBookingProfile.invalidate(), utils.admin.getAnalytics.invalidate()]);
    },
    onError: (error) => setMessage(error.message),
  });
  const addCommunication = trpc.admin.addGuestCommunication.useMutation({
    onSuccess: async () => {
      setCommunication({ channel: "note", summary: "" });
      setMessage("Communication note saved.");
      await utils.admin.getBookingProfile.invalidate();
    },
    onError: (error) => setMessage(error.message),
  });

  useEffect(() => {
    const booking = profile.data?.booking;
    if (!booking) return;
    setDraft({
      bookingSelection: booking.bookingSelection as BookingSelection,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone ?? "",
      guestCount: String(booking.guestCount),
      checkIn: dateValue(booking.checkIn),
      checkOut: dateValue(booking.checkOut),
      totalAmount: String(booking.totalAmount ?? "0"),
      cleaningFee: String(booking.cleaningFee ?? "0"),
      specialRequests: booking.specialRequests ?? "",
    });
  }, [profile.data?.booking]);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (bookings.data ?? []).filter((booking) => {
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      const matchesSearch = !term || [booking.guestName, booking.guestEmail, booking.guestPhone, booking.bookingSelection, String(booking.id)].some((value) => String(value ?? "").toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [bookings.data, search, statusFilter]);

  const selected = profile.data?.booking;
  const nights = nightsBetween(draft.checkIn, draft.checkOut);

  const saveDetails = () => {
    if (!selectedBookingId) return;
    updateBooking.mutate({
      id: selectedBookingId,
      bookingSelection: draft.bookingSelection,
      guestName: draft.guestName,
      guestEmail: draft.guestEmail,
      guestPhone: draft.guestPhone || undefined,
      guestCount: Number(draft.guestCount),
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      totalAmount: Number(draft.totalAmount),
      cleaningFee: Number(draft.cleaningFee),
      specialRequests: draft.specialRequests || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-caption text-[var(--ochre-600)]">OPERATIONS</p>
            <h2 className="text-2xl font-serif font-bold text-[var(--forest-900)]">Bookings & customer profiles</h2>
            <p className="text-sm text-[var(--slate-600)] mt-2">Click any booking to open the complete customer record, edit the reservation, manage its status, and review staff communications.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 min-w-0 lg:min-w-[430px]">
            <label className="relative flex-1"><Search className="absolute left-3 top-3 w-4 h-4 text-[var(--slate-500)]" /><input className="input-eco pl-9" placeholder="Search guest, email or booking ID" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
            <select className="input-eco sm:w-36" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | BookingStatus)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option><option value="refunded">Refunded</option></select>
          </div>
        </div>
        {filteredBookings.length === 0 ? <p className="text-[var(--slate-600)]">No bookings match your filters.</p> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-[var(--cream-300)]"><th className="text-left py-3 pr-3">Customer</th><th className="text-left py-3 pr-3">Stay</th><th className="text-left py-3 pr-3">Booked</th><th className="text-left py-3 pr-3">Status</th><th className="text-right py-3">Total</th></tr></thead><tbody>{filteredBookings.map((booking) => <tr key={booking.id} tabIndex={0} role="button" onClick={() => setSelectedBookingId(booking.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedBookingId(booking.id); }} className={`border-b border-[var(--cream-200)] cursor-pointer transition-colors hover:bg-[var(--cream-100)] ${selectedBookingId === booking.id ? "bg-[var(--forest-50)]" : ""}`}><td className="py-4 pr-3"><strong className="text-[var(--forest-900)]">{booking.guestName}</strong><span className="block text-xs text-[var(--slate-500)]">{booking.guestEmail}</span><span className="block text-xs text-[var(--slate-500)]">Booking #{booking.id}</span></td><td className="py-4 pr-3"><span className="block">{dateValue(booking.checkIn)} → {dateValue(booking.checkOut)}</span><span className="text-xs text-[var(--slate-500)]">{selectionLabel(booking.bookingSelection)} · {booking.guestCount} guests</span></td><td className="py-4 pr-3 text-xs text-[var(--slate-500)]">{dateValue(booking.createdAt)}</td><td className="py-4 pr-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(booking.status as BookingStatus)}`}>{booking.status}</span></td><td className="py-4 text-right font-semibold">€{booking.totalAmount}</td></tr>)}</tbody></table></div>}
      </Card>

      {!selectedBookingId ? <Card className="p-8 border-dashed"><div className="max-w-xl mx-auto text-center"><UserRound className="w-10 h-10 mx-auto text-[var(--ochre-600)] mb-3" /><h3 className="text-xl font-serif font-bold text-[var(--forest-900)]">Select a booking to manage it</h3><p className="text-sm text-[var(--slate-600)] mt-2">The customer profile, reservation details, payment information, status controls, and communication history will appear here.</p></div></Card> : profile.isLoading ? <Card className="p-8 text-center text-[var(--slate-600)]">Loading customer profile…</Card> : !selected ? <Card className="p-8 text-center text-[var(--slate-600)]">This booking could not be found.</Card> : <div className="grid xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)] gap-6">
        <div className="space-y-6">
          <Card className="p-6"><div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6"><div><p className="text-caption text-[var(--ochre-600)]">CUSTOMER PROFILE</p><h3 className="text-2xl font-serif font-bold text-[var(--forest-900)]">{selected.guestName}</h3><p className="text-sm text-[var(--slate-600)] mt-1">Customer record for {selected.guestEmail}</p></div><span className={`self-start inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClass(selected.status as BookingStatus)}`}>{selected.status}</span></div><div className="grid sm:grid-cols-2 gap-3"><a href={`mailto:${selected.guestEmail}`} className="rounded-xl bg-[var(--cream-100)] p-4 hover:bg-[var(--cream-200)]"><Mail className="w-4 h-4 text-[var(--ochre-600)] mb-2" /><span className="block text-xs text-[var(--slate-500)]">Email</span><strong className="text-sm break-all">{selected.guestEmail}</strong></a><a href={selected.guestPhone ? `tel:${selected.guestPhone}` : undefined} className="rounded-xl bg-[var(--cream-100)] p-4 hover:bg-[var(--cream-200)]"><Phone className="w-4 h-4 text-[var(--ochre-600)] mb-2" /><span className="block text-xs text-[var(--slate-500)]">Phone</span><strong className="text-sm">{selected.guestPhone || "Not provided"}</strong></a></div><div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm"><div><span className="block text-xs text-[var(--slate-500)]">Customer bookings</span><strong>{profile.data?.guestBookings.length ?? 0}</strong></div><div><span className="block text-xs text-[var(--slate-500)]">GDPR consent</span><strong>{selected.gdprConsent ? "Granted" : "Not recorded"}</strong></div><div><span className="block text-xs text-[var(--slate-500)]">Source</span><strong>{selected.source}</strong></div><div><span className="block text-xs text-[var(--slate-500)]">Property</span><strong>{profile.data?.property?.nameEn ?? "Green Cottages"}</strong></div></div></Card>

          <Card className="p-6"><div className="flex items-center justify-between gap-3 mb-5"><div><p className="text-caption text-[var(--ochre-600)]">RESERVATION</p><h3 className="text-xl font-serif font-bold text-[var(--forest-900)]">Manage booking #{selected.id}</h3></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: selected.id, status: "confirmed" })} disabled={updateStatus.isPending || selected.status === "confirmed"}><CheckCircle2 className="w-4 h-4 mr-1" />Confirm</Button><Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: selected.id, status: "cancelled" })} disabled={updateStatus.isPending || selected.status === "cancelled"}><XCircle className="w-4 h-4 mr-1" />Cancel</Button></div></div><div className="grid md:grid-cols-2 gap-3"><label className="text-sm font-medium">Booking selection<select className="input-eco mt-1" value={draft.bookingSelection} onChange={(event) => setDraft({ ...draft, bookingSelection: event.target.value as BookingSelection })}><option value="both">Both cottages</option><option value="la-seve">La Sève</option><option value="le-bois">Le Bois</option></select></label><label className="text-sm font-medium">Guest count<input className="input-eco mt-1" type="number" min="1" max="12" value={draft.guestCount} onChange={(event) => setDraft({ ...draft, guestCount: event.target.value })} /></label><label className="text-sm font-medium">Check-in<input className="input-eco mt-1" type="date" value={draft.checkIn} onChange={(event) => setDraft({ ...draft, checkIn: event.target.value })} /></label><label className="text-sm font-medium">Check-out<input className="input-eco mt-1" type="date" value={draft.checkOut} onChange={(event) => setDraft({ ...draft, checkOut: event.target.value })} /></label><label className="text-sm font-medium">Guest name<input className="input-eco mt-1" value={draft.guestName} onChange={(event) => setDraft({ ...draft, guestName: event.target.value })} /></label><label className="text-sm font-medium">Guest email<input className="input-eco mt-1" type="email" value={draft.guestEmail} onChange={(event) => setDraft({ ...draft, guestEmail: event.target.value })} /></label><label className="text-sm font-medium">Phone<input className="input-eco mt-1" value={draft.guestPhone} onChange={(event) => setDraft({ ...draft, guestPhone: event.target.value })} /></label><label className="text-sm font-medium">Total amount (€)<input className="input-eco mt-1" type="number" min="0" step="0.01" value={draft.totalAmount} onChange={(event) => setDraft({ ...draft, totalAmount: event.target.value })} /></label><label className="text-sm font-medium">Cleaning fee (€)<input className="input-eco mt-1" type="number" min="0" step="0.01" value={draft.cleaningFee} onChange={(event) => setDraft({ ...draft, cleaningFee: event.target.value })} /></label><label className="text-sm font-medium">Nights<div className="input-eco mt-1 bg-[var(--cream-100)]">{nights}</div></label><label className="text-sm font-medium md:col-span-2">Special requests / internal booking note<textarea className="input-eco mt-1 min-h-24" value={draft.specialRequests} onChange={(event) => setDraft({ ...draft, specialRequests: event.target.value })} /></label></div><Button className="btn-primary mt-5" onClick={saveDetails} disabled={updateBooking.isPending}><Save className="w-4 h-4 mr-2" />{updateBooking.isPending ? "Saving…" : "Save booking details"}</Button></Card>

          <Card className="p-6"><div className="flex items-center gap-3 mb-4"><CreditCard className="w-5 h-5 text-[var(--ochre-600)]" /><div><h3 className="text-xl font-serif font-bold text-[var(--forest-900)]">Payment and audit details</h3><p className="text-sm text-[var(--slate-600)]">Keep a complete operational record of how this booking was created and paid.</p></div></div><dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm"><div><dt className="text-xs text-[var(--slate-500)]">Total recorded</dt><dd className="font-semibold">€{selected.totalAmount}</dd></div><div><dt className="text-xs text-[var(--slate-500)]">Cleaning fee</dt><dd className="font-semibold">€{selected.cleaningFee}</dd></div><div><dt className="text-xs text-[var(--slate-500)]">Stripe session</dt><dd className="font-mono text-xs break-all">{selected.stripeSessionId || "Not created"}</dd></div><div><dt className="text-xs text-[var(--slate-500)]">Payment intent</dt><dd className="font-mono text-xs break-all">{selected.stripePaymentIntentId || "Not recorded"}</dd></div><div><dt className="text-xs text-[var(--slate-500)]">Created</dt><dd>{String(selected.createdAt)}</dd></div><div><dt className="text-xs text-[var(--slate-500)]">Last updated</dt><dd>{String(selected.updatedAt)}</dd></div></dl><div className="flex flex-wrap gap-2 mt-5"><Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: selected.id, status: "pending" })} disabled={updateStatus.isPending}><RefreshCcw className="w-4 h-4 mr-1" />Set pending</Button><Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: selected.id, status: "refunded" })} disabled={updateStatus.isPending}><CreditCard className="w-4 h-4 mr-1" />Mark refunded</Button></div></Card>
        </div>

        <div className="space-y-6"><Card className="p-6"><div className="flex items-center gap-3 mb-4"><MessageSquare className="w-5 h-5 text-[var(--ochre-600)]" /><div><h3 className="text-xl font-serif font-bold text-[var(--forest-900)]">Communication history</h3><p className="text-sm text-[var(--slate-600)]">Record calls, emails, and private staff notes for this customer.</p></div></div><div className="space-y-3">{(profile.data?.communications ?? []).length === 0 ? <p className="text-sm text-[var(--slate-500)]">No communications recorded yet.</p> : (profile.data?.communications ?? []).map((entry) => <div key={entry.id} className="rounded-xl bg-[var(--cream-100)] p-3"><div className="flex justify-between gap-3 text-xs"><strong className="capitalize text-[var(--forest-900)]">{entry.channel}</strong><span className="text-[var(--slate-500)]">{String(entry.createdAt)}</span></div><p className="text-sm mt-1">{entry.summary}</p><p className="text-xs text-[var(--slate-500)] mt-1">Added by {entry.createdBy || "Admin"}</p></div>)}</div><div className="border-t border-[var(--cream-200)] mt-5 pt-5"><select className="input-eco mb-2" value={communication.channel} onChange={(event) => setCommunication({ ...communication, channel: event.target.value as CommunicationDraft["channel"] })}><option value="note">Private note</option><option value="email">Email</option><option value="phone">Phone call</option></select><textarea className="input-eco min-h-24" placeholder="Record what happened or what needs to be followed up…" value={communication.summary} onChange={(event) => setCommunication({ ...communication, summary: event.target.value })} /><Button className="btn-primary mt-2 w-full" onClick={() => addCommunication.mutate({ guestEmail: selected.guestEmail, bookingId: selected.id, channel: communication.channel, summary: communication.summary })} disabled={!communication.summary.trim() || addCommunication.isPending}><MessageSquare className="w-4 h-4 mr-2" />Save communication</Button></div></Card><Card className="p-6"><h3 className="text-xl font-serif font-bold text-[var(--forest-900)] mb-4">Customer booking history</h3><div className="space-y-3">{(profile.data?.guestBookings ?? []).map((item) => <button type="button" key={item.id} onClick={() => setSelectedBookingId(item.id)} className={`w-full text-left rounded-xl p-3 transition-colors ${item.id === selected.id ? "bg-[var(--forest-100)]" : "bg-[var(--cream-100)] hover:bg-[var(--cream-200)]"}`}><div className="flex items-center justify-between gap-3"><strong className="text-sm">Booking #{item.id}</strong><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusClass(item.status as BookingStatus)}`}>{item.status}</span></div><p className="text-xs text-[var(--slate-600)] mt-1">{dateValue(item.checkIn)} → {dateValue(item.checkOut)} · {selectionLabel(item.bookingSelection)}</p><p className="text-xs text-[var(--slate-600)]">{item.guestCount} guests · €{item.totalAmount}</p></button>)}</div></Card><Card className="p-6 bg-[var(--forest-950)] text-white"><CalendarDays className="w-5 h-5 text-[var(--ochre-400)] mb-3" /><h3 className="font-serif text-xl font-bold">Staff workflow reminder</h3><p className="text-sm text-[var(--cream-200)] mt-2">Changing dates or guest count does not automatically collect a payment difference. Record the adjustment, update the booking total, and handle any additional payment or refund through Stripe before confirming the final amount.</p></Card></div>
      </div>}
      {message && <p className="text-sm text-[var(--forest-700)]">{message}</p>}
    </div>
  );
}
