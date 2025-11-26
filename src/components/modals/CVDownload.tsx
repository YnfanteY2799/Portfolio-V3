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
} from "../ui/dialog";

export default function CVDownloadModal(): ReactNode {
	return (
		<InteractiveModal>
			<InteractiveModalTrigger asChild>
				<Button variant="outline" className="w-full bg-transparent">
					Default Modal
				</Button>
			</InteractiveModalTrigger>
			<InteractiveModalContent backdrop="blur">
				<InteractiveModalHeader>
					<InteractiveModalTitle>Default Modal</InteractiveModalTitle>
					<InteractiveModalDescription>This is a standard modal with smooth slide animations.</InteractiveModalDescription>
				</InteractiveModalHeader>
				<InteractiveModalBody>
					<p className="text-sm">
						This modal features smooth Framer Motion animations. On mobile, you can drag it up to go fullscreen or drag down to dismiss.
					</p>
				</InteractiveModalBody>
				<InteractiveModalFooter>
					<InteractiveModalClose asChild>
						<Button variant="outline">Close</Button>
					</InteractiveModalClose>
					<Button>Save Changes</Button>
				</InteractiveModalFooter>
			</InteractiveModalContent>
		</InteractiveModal>
	);
}
