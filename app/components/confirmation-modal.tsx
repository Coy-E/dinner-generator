interface ConfirmationModalProps {
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const ConfirmationModal = ({
	title,
	message,
	onConfirm,
	onCancel
}: ConfirmationModalProps) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
			<div className="w-full max-w-md rounded-xl bg-gray-800 p-6 shadow-2xl">
				<h2 className="mb-4 text-xl font-bold text-orange-400">{title}</h2>
				<p className="mb-6 text-white">{message}</p>
				<div className="flex justify-end space-x-4">
					<button
						className="rounded-lg bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
						type="button"
						onClick={onCancel}
					>
						Cancel
					</button>
					<button
						className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
						type="button"
						onClick={onConfirm}
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
