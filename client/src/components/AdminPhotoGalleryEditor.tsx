import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileImage, GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

type GalleryPhoto = {
  id: number;
  url: string;
  caption: string | null;
  displayOrder: number;
  isHeroImage: boolean;
};

type Props = {
  propertyId: number;
  photos: GalleryPhoto[];
  onMessage: (message: string) => void;
};

const emptyPhoto = { url: "", caption: "", displayOrder: "0" };

export default function AdminPhotoGalleryEditor({ propertyId, photos, onMessage }: Props) {
  const [draft, setDraft] = useState<GalleryPhoto[]>(photos);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
  const [photoEdit, setPhotoEdit] = useState({ url: "", caption: "", displayOrder: "0", isHeroImage: false });
  const [photo, setPhoto] = useState(emptyPhoto);
  const [isDirty, setIsDirty] = useState(false);
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!isDirty) setDraft(photos);
  }, [photos, isDirty]);

  const saveOrder = trpc.admin.reorderPropertyPhotos.useMutation({
    onSuccess: async () => {
      setIsDirty(false);
      onMessage("Gallery order saved.");
      await utils.admin.getPropertyPhotos.invalidate({ propertyId });
    },
    onError: (error) => onMessage(error.message || "Could not save gallery order."),
  });
  const addPhoto = trpc.admin.addPropertyPhoto.useMutation({
    onSuccess: async () => {
      setPhoto(emptyPhoto);
      onMessage("Photo added.");
      await utils.admin.getPropertyPhotos.invalidate({ propertyId });
    },
  });
  const updatePhoto = trpc.admin.updatePropertyPhoto.useMutation({
    onSuccess: async () => {
      setEditingPhotoId(null);
      onMessage("Photo updated.");
      await utils.admin.getPropertyPhotos.invalidate({ propertyId });
    },
  });
  const deletePhoto = trpc.admin.deletePropertyPhoto.useMutation({
    onSuccess: async () => {
      onMessage("Photo removed.");
      await utils.admin.getPropertyPhotos.invalidate({ propertyId });
    },
  });

  const movePhoto = (targetId: number) => {
    if (draggedId === null || draggedId === targetId) return;
    const from = draft.findIndex((item) => item.id === draggedId);
    const to = draft.findIndex((item) => item.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...draft];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setDraft(next);
    setIsDirty(true);
    setDraggedId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-5">
        <FileImage className="w-5 h-5 text-[var(--ochre-600)]" />
        <div>
          <h2 className="text-xl font-serif font-bold text-[var(--forest-900)]">Photo gallery</h2>
          <p className="text-sm text-[var(--slate-600)]">Drag and drop photos to set the public gallery sequence. Changes are saved together.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_1fr_120px_auto] gap-3">
        <input className="input-eco" placeholder="https://… or /manus-storage/…" value={photo.url} onChange={(event) => setPhoto({ ...photo, url: event.target.value })} />
        <input className="input-eco" placeholder="Caption / alt text" value={photo.caption} onChange={(event) => setPhoto({ ...photo, caption: event.target.value })} />
        <input className="input-eco" type="number" min="0" placeholder="Order" value={photo.displayOrder} onChange={(event) => setPhoto({ ...photo, displayOrder: event.target.value })} />
        <Button className="btn-primary" onClick={() => addPhoto.mutate({ propertyId, url: photo.url, caption: photo.caption, displayOrder: Number(photo.displayOrder), isHeroImage: false })} disabled={!photo.url || addPhoto.isPending}><Plus className="w-4 h-4 mr-1" />Add</Button>
      </div>

      <div className="rounded-xl border border-dashed border-[var(--forest-300)] bg-[var(--cream-50)] p-3 text-sm text-[var(--slate-600)]">
        On desktop, drag a card by its handle. On mobile, press and hold a card, then drag it above or below another image. The numbered sequence is the live public order.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {draft.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDraggedId(item.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => movePhoto(item.id)}
            onDragEnd={() => setDraggedId(null)}
            onTouchStart={() => setDraggedId(item.id)}
            onTouchMove={(event) => {
              const touch = event.touches[0];
              const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest<HTMLElement>("[data-gallery-photo-id]");
              const targetId = target ? Number(target.dataset.galleryPhotoId) : null;
              if (targetId) movePhoto(targetId);
            }}
            onTouchEnd={() => setDraggedId(null)}
            data-gallery-photo-id={item.id}
            className={`rounded-lg border overflow-hidden bg-white transition-shadow ${draggedId === item.id ? "opacity-50 ring-2 ring-[var(--ochre-500)]" : "border-[var(--cream-300)]"}`}
          >
            <div className="relative">
              <img src={item.url} alt={item.caption || `Property gallery image ${index + 1}`} className="w-full h-32 object-cover" loading="lazy" />
              <div className="absolute top-2 left-2 rounded-full bg-[var(--forest-950)]/85 px-2 py-1 text-xs font-semibold text-white">{index + 1}</div>
              <button type="button" draggable={false} aria-label={`Drag image ${index + 1}`} className="absolute top-2 right-2 rounded-lg bg-white/90 p-2 text-[var(--forest-900)] shadow cursor-grab active:cursor-grabbing touch-none"><GripVertical className="w-4 h-4" /></button>
            </div>
            <div className="p-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs truncate">{item.caption || "Untitled"}</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => { setEditingPhotoId(item.id); setPhotoEdit({ url: item.url, caption: item.caption ?? "", displayOrder: String(item.displayOrder), isHeroImage: item.isHeroImage }); }}>Edit</Button>
                  <Button variant="outline" size="sm" aria-label={`Delete image ${index + 1}`} onClick={() => deletePhoto.mutate({ id: item.id, propertyId })}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--slate-500)]"><span>Sequence {index + 1}</span><span>{item.isHeroImage ? "Hero image" : ""}</span></div>
              {editingPhotoId === item.id && <div className="mt-3 space-y-2">
                <input className="input-eco" placeholder="Image URL" value={photoEdit.url} onChange={(event) => setPhotoEdit({ ...photoEdit, url: event.target.value })} />
                <input className="input-eco" placeholder="Caption / alt text" value={photoEdit.caption} onChange={(event) => setPhotoEdit({ ...photoEdit, caption: event.target.value })} />
                <div className="grid grid-cols-2 gap-2"><input className="input-eco" type="number" min="0" value={photoEdit.displayOrder} onChange={(event) => setPhotoEdit({ ...photoEdit, displayOrder: event.target.value })} /><label className="flex items-center gap-2 text-xs text-[var(--slate-600)]"><input type="checkbox" checked={photoEdit.isHeroImage} onChange={(event) => setPhotoEdit({ ...photoEdit, isHeroImage: event.target.checked })} />Hero image</label></div>
                <div className="flex gap-2"><Button className="btn-primary" size="sm" onClick={() => updatePhoto.mutate({ id: item.id, propertyId, url: photoEdit.url, caption: photoEdit.caption, displayOrder: Number(photoEdit.displayOrder), isHeroImage: photoEdit.isHeroImage })} disabled={!photoEdit.url || updatePhoto.isPending}>Save</Button><Button variant="outline" size="sm" onClick={() => setEditingPhotoId(null)}>Cancel</Button></div>
              </div>}
            </div>
          </div>
        ))}
      </div>

      {isDirty && <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-xl bg-[var(--forest-950)] p-3 text-white shadow-xl"><span className="text-sm">Unsaved gallery order</span><Button className="bg-[var(--ochre-500)] text-[var(--forest-950)] hover:bg-[var(--ochre-400)]" onClick={() => saveOrder.mutate({ propertyId, photoIds: draft.map((item) => item.id) })} disabled={saveOrder.isPending}><Save className="w-4 h-4 mr-2" />Save order</Button></div>}
    </div>
  );
}
