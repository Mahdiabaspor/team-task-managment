"use client"
import {useDroppable} from '@dnd-kit/core';

function Droppable({id, children}:{id:string, children:React.ReactNode}) {
  const {setNodeRef,} = useDroppable({
    id,
  });

  return (
    <div className='bg-black/10 w-full h-full flex justify-start items-center flex-col' ref={setNodeRef}  >
      {children}
    </div>
  );
}


export default Droppable