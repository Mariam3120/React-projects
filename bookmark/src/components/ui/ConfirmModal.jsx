import { Modal } from "./Modal";
import { Button } from "./Button";
import styles from "./ConfirmModal.module.css";

export function ConfirmModal({
    title,
    message,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
}) {
    return (
        // დახურვა და გაუქმება ერთი და იგივეა
        <Modal title={title} onClose={onCancel}>
            <p>{message}</p>

            <div className={styles.actions}>
                {/* რიგი მნიშვნელოვანია: საშიში მოქმედება მარჯვნივ,
                    უსაფრთხო გასასვლელი — მარცხნივ */}
                <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
                <Button variant="danger" onClick={onConfirm} autoFocus>{confirmLabel}</Button>
            </div>
        </Modal>
    );
}