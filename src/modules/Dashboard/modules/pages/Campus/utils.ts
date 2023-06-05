import { Dispatch, SetStateAction } from "react"
import { privateGateway } from "../../../../../services/apiGateway"
import { campusRoutes, tableRoutes } from "../../../../../services/urls"
import { selectProps } from "../../utils/setupUtils"
export interface CampusPageProps {
    campus: string
    category: string
    zone: string
    district: string
    legislativeAssembly: string
    block: string
    status: string
    identified: string
    confirmed: string
    connection: string
    orientation: string
    execom: string
}
export function getCampusInfo(
    id: string,
    setCampus: React.Dispatch<React.SetStateAction<CampusPageProps>>,

) {
    privateGateway.get(`${campusRoutes.campus.info}${id}/`)
        .then(res => res.data.response)
        .then(data => setCampus(campusData => ({
            ...campusData,
            campus: data.name,
            category: data.institute_type,
            district: data.district,
            status: data.club_status,
            zone: data.zone,
            legislativeAssembly: data.legislative_assembly,
            block: data.block,
            identified: data.date_of_identification,
            confirmed: data.date_of_confirmation,
            connection: data.date_of_connection,
            orientation: data.date_of_orientaion,
            execom: data.date_of_execom_formation,
        })))
        .catch(err => console.error(err))
}
export function formatDateStyle(value: string) {
    if (value === null || value === '' || value === undefined) {
        return ''
    }
    const date = new Date(value);
    const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    return formattedDate// Output: "29 May 2023"
}
export function getCategory(value: string) {
    if (value === 'School') {
        return 'Model School'
    }
    if (value === 'College') {
        return 'YIP Club'
    }
    return ''
}
export function deleteModelSchool(id: string, reRoute: () => void) {
    privateGateway.delete(`${tableRoutes.school.delete}${id}/`)
        .then(() => {
            reRoute()
            // console.log(res?.data?.message?.general[0])
        })
        .catch(err => console.log(err?.response?.data?.message?.general[0]))
}
export function getPocRoles(setDesignationList: Dispatch<SetStateAction<selectProps[]>>) {
    privateGateway.get(campusRoutes.designation.list.facilitator)
        .then((res) => (res.data.response.sub_user_roles))
        .then((data) =>
            setDesignationList(
                data.map((item: { value: string, label: string }, index: string) => ({ id: item.value, name: item.label }))
            ))
}