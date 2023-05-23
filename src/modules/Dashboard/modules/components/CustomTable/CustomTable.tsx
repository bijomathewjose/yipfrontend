
import { useState } from "react"
import { paginateArray } from "../../utils/utils"
import './customTable.scss'
interface sortProps {
    status: string;
    updater: boolean;

}
function CustomTable<TableProps>({
    tableHeadList,
    tableData,
    orderBy,
    sortOrder,
    customCSS,
    manage,
}:
    {
        tableHeadList: string[]
        tableData: TableProps[]
        orderBy: (keyof TableProps)[]
        sortOrder?: {
            sortBy: keyof TableProps
            orderList: string[]
            orderSymbol: {
                asc: string
                desc: string
            }
        },
        customCSS?: {
            name: string
            css: string
        }[]
        manage?: {
            value: string
            manageFunction: any
        },
    }) {
    const [page, setPage] = useState(1)
    const [sortedTable, setSortedTable] = useState(tableData)
    const [sort, setSort] = useState<sortProps>({ updater: false, status: "Unsorted" })
    const [selectedHeading, setSelectedHeading] = useState<number>(-1)

    function capitalizeString(sentence: string): string {
        let capitalizedSentence = sentence.toLowerCase();
        capitalizedSentence = capitalizedSentence.charAt(0).toUpperCase() + capitalizedSentence.slice(1);
        for (let i = 2; i < capitalizedSentence.length - 1; i++)
            if (capitalizedSentence.charAt(i).match(/[^\w\']/))
                capitalizedSentence = capitalizedSentence.slice(0, i + 1) + capitalizedSentence.charAt(i + 1).toUpperCase() + capitalizedSentence.slice(i + 2);
        return capitalizedSentence;
    }
    function sortTable(index: number) {

        sortedTable.sort((a: any, b: any) => {
            const isNotSorted = sort.status === "Unsorted" || sort.status === "Sorted:DESC"
            if (a[orderBy[index]] < b[orderBy[index]]) return isNotSorted ? -1 : 1
            if (a[orderBy[index]] > b[orderBy[index]]) return isNotSorted ? 1 : -1
            return 0
        })
        setSortedTable(sortedTable)
        setSort((prev: sortProps) => {
            return {
                ...prev,
                updater: !prev.updater,
                status: sortStatusUpdater(sort.status)
            }
        })
    }
    function sortOrderByRequired(index: number) {
        if (sortOrder?.sortBy === orderBy[index]) sortByOrder(index)
        else { sortTable(index) }
    }
    function sortByOrder(index: number): void {
        let tempTable: TableProps[] = []
        let listOrder = sort.status === 'Unsorted' ? sortOrder?.orderList : sortOrder?.orderList.reverse()
        listOrder?.map((value: string) => {
            tempTable.push(
                ...sortedTable.filter((item: TableProps) => item[orderBy[index]] === value)
            )
        })
        setSortedTable(tempTable)
        setSort((prev: sortProps) => {
            return {
                ...prev,
                updater: !prev.updater,
                status: sortStatusUpdater(sort.status)
            }
        })
    }

    function getIconStyleForSortedHeading(index: number): string {
        if (selectedHeading === index) {
            if (sortOrder?.sortBy === orderBy[index]) {
                switch (sort.status) {
                    case 'Sorted:ASC': return sortOrder?.orderSymbol.asc as string + ' selected';
                    case 'Sorted:DESC': return sortOrder?.orderSymbol.desc as string + ' selected'
                }
            }
            else {
                switch (sort.status) {
                    case 'Sorted:ASC': return 'fa-arrow-up-a-z  selected'
                    case 'Sorted:DESC': return 'fa-arrow-up-z-a selected'
                }
            }
        }
        if (orderBy[index] === sortOrder?.sortBy) {
            return (sortOrder.orderSymbol.asc)
        }
        return 'fa-arrow-up-a-z'
    }

    function customCssByRequired(index: number): string {
        if (customCSS) {
            for (let item of customCSS) {
                if (item.name === orderBy[index])
                    return item.css
            }
        }
        return ''
    }
    function sortStatusUpdater(value: string) {
        switch (value) {
            case "Unsorted": return 'Sorted:ASC'
            case "Sorted:ASC": return 'Sorted:DESC'
            case "Sorted:DESC": return 'Sorted:ASC'
        }
        return ''
    }

    return (
        <div className="table-wrap">

            <table className='table '>
                {/* Table Header */}
                <thead>
                    <tr>
                        <th >
                            <div className="th-wrap ">
                                <div>{'SL.No'}</div>
                            </div>
                        </th>
                        {tableHeadList.map((item: string, index: number) => (
                            <th key={index} onClick={() => {
                                sortOrderByRequired(index)
                                setSelectedHeading(index)
                            }}>
                                <div className="th-wrap cursor">
                                    <i className={`fa-solid ${getIconStyleForSortedHeading(index)}`}></i>
                                    <div>{item}</div>

                                </div>
                            </th>)
                        )}
                        {manage?.value &&
                            <th >
                                <div className="th-wrap">
                                    <div>{'Manage'}</div>
                                </div>
                            </th>
                        }
                    </tr>
                </thead>

                {/* Table Body */}

                <tbody>
                    {paginateArray(sortedTable, page).map((item: TableProps, key: number) =>
                    (
                        <tr key={key} >
                            <td >{(page - 1) * 10 + key + 1}</td>
                            {
                                orderBy.map((item2: keyof TableProps, index: number) => (
                                    <td className={`${customCssByRequired(index)}`} key={index}>{capitalizeString(item[item2] as string)}</td>
                                )
                                )
                            }
                            {manage?.value &&
                                <td >
                                    <div className="edit-btn" onClick={manage?.manageFunction}>
                                        <i className="fas fa-edit "></i>
                                        Edit
                                    </div>
                                </td>
                            }
                        </tr>
                    )
                    )}
                </tbody>
            </table >

            {/* Pagination */}

            <div className='paginator' >
                <div>
                    <div onClick={() => { setPage(1) }}>
                        <i   >{"|<<"}</i>
                    </div>
                    <div onClick={() => { setPage(page > 1 ? page - 1 : 1) }}>
                        <i >{"|<"}</i>
                    </div>
                    <div className="input">
                        {`${page} / ${Math.trunc(sortedTable.length / 10) + (sortedTable.length % 10 ? 1 : 0)}`}
                    </div>
                    <div onClick={() => { if (page < Math.trunc(sortedTable.length / 10) + (sortedTable.length % 10 ? 1 : 0)) setPage(page + 1) }}>
                        <i >{">|"}</i></div>
                    <div onClick={() => { setPage(Math.trunc(sortedTable.length / 10) + (sortedTable.length % 10 ? 1 : 0)) }}>
                        <i >{">>|"}</i>
                    </div>
                </div>
            </div >
        </div>
    )
}
export default CustomTable