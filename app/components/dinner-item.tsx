interface DinnerItemProps {
	id: string;
	name: string;
	isPinned: boolean;
	onDelete: (id: string) => void;
	onTogglePin: (id: string) => void;
	listType: "pool" | "generated";
}

const DinnerItem = ({
	id,
	name,
	isPinned,
	onDelete,
	onTogglePin,
	listType
}: DinnerItemProps) => {
	return (
		<li className="flex items-center justify-between rounded-lg bg-gray-800 p-3 shadow-sm transition hover:bg-gray-700">
			<div className="flex items-center">
				<button
					title={isPinned ? "Unpin" : "Pin"}
					type="button"
					className={`mr-2 text-lg ${
						isPinned ? "text-yellow-500" : "text-gray-500"
					}`}
					onClick={() => onTogglePin(id)}
				>
					{isPinned ? "★" : "☆"}
				</button>
				<span className="text-lg font-medium text-white">{name}</span>
			</div>
			<button
				className="rounded-lg bg-red-600/80 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700"
				type="button"
				onClick={() => onDelete(id)}
			>
				{listType === "pool" ? "Delete" : "Remove"}
			</button>
		</li>
	);
};

export default DinnerItem;
