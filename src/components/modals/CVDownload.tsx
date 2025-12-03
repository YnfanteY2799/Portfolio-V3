import { type ReactNode } from "react";
import Button from "../ui/Button/index.tsx";
import {
	InteractiveModal,
	InteractiveModalTrigger,
	InteractiveModalContent,
	InteractiveModalHeader,
	InteractiveModalTitle,
	InteractiveModalDescription,
	InteractiveModalBody,
	InteractiveModalFooter,
	InteractiveModalClose,
} from "../ui/dlogv2.tsx";

export default function CVDownloadModal(): ReactNode {
	return (
		<InteractiveModal>
			<InteractiveModalTrigger asChild>
				{/* Trigger */}
				<Button variant="outline" className="w-full bg-transparent">
					Scrollable Content
				</Button>
			</InteractiveModalTrigger>
			<InteractiveModalContent size="2xl" scrollable>
				<InteractiveModalHeader>
					<InteractiveModalTitle>Scrollable Modal</InteractiveModalTitle>
					<InteractiveModalDescription>Only the content area scrolls, header and footer stay fixed.</InteractiveModalDescription>
				</InteractiveModalHeader>
				<InteractiveModalBody>
					<div className="space-y-4">
						{Array.from({ length: 300 }).map((_, i) => (
							<div key={i} className="p-4 bg-muted rounded-lg">
								<h3 className="font-semibold mb-2">Section {i + 1}</h3>
								<p className="text-sm text-muted-foreground">
									This is scrollable content. Notice how the header and footer remain fixed while you scroll through this content area.
								</p>
							</div>
						))}
					</div>
				</InteractiveModalBody>
				<InteractiveModalFooter>
					<InteractiveModalClose asChild>
						<Button variant="outline">Close</Button>
					</InteractiveModalClose>
					<Button>Accept</Button>
				</InteractiveModalFooter>
			</InteractiveModalContent>
		</InteractiveModal>
	);
}
