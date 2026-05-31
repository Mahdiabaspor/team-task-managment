"use client"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DropDownContainer from "@/components/dropDownContainer";
export default function SortableContainer({
  container,
  children,
}: {
  container: any;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: container.id,
    data: {
      type: "container",
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}

      className="w-72 min-h-100 bg-gray-50 rounded-xl flex flex-col border relative"
    >
      <div 
        className="bg-black p-3 w-full rounded-t-xl"       
        {...attributes}
        {...listeners}
        suppressHydrationWarning
      >
        <h3 className="font-bold text-center text-white">
          {container.title}
        </h3>

        <DropDownContainer containerId={container.id} />
      </div>
      {children}
    </div>
  );
}

