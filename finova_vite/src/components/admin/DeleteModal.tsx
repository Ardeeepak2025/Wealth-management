import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";

export function DeleteModal({ open, title, description, onClose, onConfirm }: { open: boolean; title: string; description: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal isOpen={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-slate-400">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
