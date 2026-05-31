import { Active, Over } from "@dnd-kit/core";
import { IProject } from "../components/dragDropContainer";
import { Dispatch, SetStateAction } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { editContainersOrders } from "@/app/actions/container-actions";

export const moveContainers = (currentProj: IProject, active: Active, over: Over ,setProject: Dispatch<SetStateAction<IProject>>) => {
    const oldIndex = currentProj.containers.findIndex(c => c.id === active.id);
    const newIndex = currentProj.containers.findIndex(c => c.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const movedArray = arrayMove(currentProj.containers, oldIndex, newIndex);


    const updatedContainers = movedArray.map((container, index) => ({
        ...container,
        order: index + 1 // ترتیب جدید بر اساس مکان فعلی در آرایه
    }));

    setProject({ ...currentProj, containers: updatedContainers });
    const ApiData = updatedContainers.map(c => ({ id: c.id, order: c.order }));
    editContainersOrders(ApiData);

};