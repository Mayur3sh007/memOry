"use client"
import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


const initialData: Workout[] = [
    {
        id: "1",
        Monday: "Chest Day",
        Tuesday: "Back Day",
        Wednesday: "Leg Day",
        Thursday: "Shoulder Day",
        Friday: "Arm Day",
        Saturday: "Cardio",
        Sunday: "Rest Day",
    },
]

export type Workout = {
    id: string
    Monday: string
    Tuesday: string
    Wednesday: string
    Thursday: string
    Friday: string
    Saturday: string
    Sunday: string
}

const EditableCell: React.FC<{
    value: string;
    row: number;
    column: string;
    onUpdate: (row: number, column: string, value: string) => void; //hnadle Cell Change

}> = ({ value: initialValue, row, column, onUpdate }) => {

    const [value, setValue] = React.useState(initialValue)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const onBlur = () => {          //only update the cell if the value has changed
        if (value !== initialValue) {
            onUpdate(row, column, value)
        }
    }

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return <Input value={value} onChange={onChange} onBlur={onBlur} />
}

export function WorkoutTable() {
    const [data, setData] = React.useState<Workout[]>(initialData);
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const columns: ColumnDef<Workout>[] = [
        {
            accessorKey: "Monday",
            header: "Monday",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.Monday}
                    row={row.index}
                    column="Monday"
                    onUpdate={handleCellChange}
                />
            ),
        },
        {
            accessorKey: "Tuesday",
            header: "Tuesday",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.Tuesday}
                    row={row.index}
                    column="Tuesday"
                    onUpdate={handleCellChange}
                />
            ),
        },
        {
            accessorKey: "Wednesday",
            header: "Wednesday",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.Wednesday}
                    row={row.index}
                    column="Wednesday"
                    onUpdate={handleCellChange}
                />
            ),
        },
        {
            accessorKey: "Thursday",
            header: "Thursday",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.Thursday}
                    row={row.index}
                    column="Thursday"
                    onUpdate={handleCellChange}
                />
            ),
        },
        {
            accessorKey: "Friday",
            header: "Friday",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.Friday}
                    row={row.index}
                    column="Friday"
                    onUpdate={handleCellChange}
                />
            ),
        },
        {
            accessorKey: "Saturday",
            header: "Saturday",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.Saturday}
                    row={row.index}
                    column="Saturday"
                    onUpdate={handleCellChange}
                />
            ),
        },
        {
            accessorKey: "Sunday",
            header: "Sunday",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.Sunday}
                    row={row.index}
                    column="Sunday"
                    onUpdate={handleCellChange}
                />
            ),
        },
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const handleAddRow = () => {
        const newRow: Workout = {
            id: (data.length + 1).toString(),
            Monday: "",
            Tuesday: "",
            Wednesday: "",
            Thursday: "",
            Friday: "",
            Saturday: "",
            Sunday: "",
        };
        setData([...data, newRow]);
    };

    const handleDeleteRow = () => {
        setData(prevData => {
            const newData = [...prevData];
            newData.splice(data.length - 1,1);
            return newData;
        });
    };

    const handleCellChange = (rowIndex: number, columnId: string, value: string) => {
        setData(prevData => {
            const newData = [...prevData];
            newData[rowIndex] = {
                ...newData[rowIndex],
                [columnId]: value
            };
            return newData;
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center py-4 ml-10">
                <Input
                    placeholder="Filter workouts..."
                    value={(table.getColumn("Monday")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("Monday")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-4">
                            Filter <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" >
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border mx-auto min-w-fit my-4 justify-center">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-row">
                <Button variant="outline" size="sm" className="ml-6" onClick={handleAddRow}>
                    Add Row
                </Button>
                <Button variant="outline" size="sm" className="ml-4" onClick={handleDeleteRow}>
                    Delete Row
                </Button>
                <Button variant="outline" size="sm" className="ml-4" onClick={handleDeleteRow}>
                    Save
                </Button>
            </div>

        </div>
    )
}

export default WorkoutTable