import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SetStateAction } from "react"

export function SelectRole({ setSelected, Selected }: { setSelected: React.Dispatch<SetStateAction<string>>, Selected: string }) {
    return (
        <Select onValueChange={(v) =>setSelected(v)}>
            <SelectTrigger className="w-30">
                <SelectValue placeholder={Selected}></SelectValue>
            </SelectTrigger>
            <SelectContent >
                <SelectGroup >
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
