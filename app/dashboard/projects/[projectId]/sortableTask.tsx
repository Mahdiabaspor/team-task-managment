"use client"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTask({
  task,
  children,
}: {
  task: any;
  children: React.ReactNode;
}) {
  // const {
  //   attributes,
  //   listeners,
  //   setNodeRef,
  //   transform,
  //   transition,
  // } = useSortable({
  //   id: task.id,
  //   data:{
  //       type: "task",
  //       ...task
  //   }
  // });

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  // };

  return (
    <div
      // ref={setNodeRef}
      // style={style}
      // {...attributes}
      // {...listeners}
      // className=""
    >
      {children}
    </div>
  );
}

