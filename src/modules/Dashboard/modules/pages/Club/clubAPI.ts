import { Dispatch, SetStateAction } from "react"
import { CountResponse } from "./ClubBanner"
import { bannerRoutes, setupRoutes, tableRoutes } from "../../../../../services/urls"
import { privateGateway } from "../../../../../services/apiGateway"
import { selectCollegeProps, selectEditedProps, selectProps } from "../../utils/setupUtils"
import { Success, showAlert } from "../../../components/Error/Alerts"
import { ClubTableProps } from "./ClubTable"
import { toast } from "react-toastify"
import { error, errorCheck, errorMessage, success } from "../../../components/Toastify/ToastifyConsts"

export const fetchInstitutionStatusCount = async (setCount: Dispatch<SetStateAction<CountResponse>>) => {
    privateGateway.get(`${bannerRoutes.clubBanner}`)
        .then(res => res.data.response)
        .then(res => setCount(res))
        .catch(err => console.error(err))
}
export function fetchDistricts(
    setData: Dispatch<SetStateAction<selectEditedProps[]>> | Dispatch<SetStateAction<selectProps[]>>,
    setData1?: Dispatch<SetStateAction<selectProps[]>>
) {
    privateGateway
        .get(setupRoutes.district.list)
        .then((res) => res.data.response.districts)
        .then((data) => {
            if (setData1) setData1(data)
            setData(
                data.map((item: { id: any; name: any }) => ({
                    id: item.id,
                    name: item.name,
                }))
            );
        })
        .catch((err) => console.error(err));
}

export function updateResponse(data: any) {
    return data.map((item: { id: any; title: any }) => ({
        id: item.id,
        name: item.title,
    }));
}

export function fetchcolleges(
    setData: Dispatch<SetStateAction<selectProps[]>>,
    districtName: string
) {
    const reqData: any = {
        district: districtName,
    };
    privateGateway
        .get(`${tableRoutes.institutes.list}${districtName}/`)
        .then((res) => res.data.response)
        .then((data) => {
            console.log(data)
            setData(data);
        })
        .catch((err) => console.error(err));
}

export function createClub<postDataProps>
    (
        postData: postDataProps,
        update: Function,
    ) {
    privateGateway.post(tableRoutes.club.create, postData)
        .then(() => {
            success();
            update()
        })
        .catch(err => {
            errorCheck(err.response);
            errorMessage(err.response)
        })
}
export function updateClubStatus(id: string, status: string,
    setClub: Dispatch<SetStateAction<ClubTableProps>>, updateClubStatus: Function,
    setSuccess: Dispatch<SetStateAction<string>>, setError: Dispatch<SetStateAction<string>>
) {
    privateGateway.put(tableRoutes.status.update, { clubId: id, clubStatus: status })
        .then(res => {
            console.log('Success :', res?.data?.message?.general[0])
            setSuccess(res?.data?.message?.general[0])
            setTimeout(() => {
                setClub({} as ClubTableProps)
                updateClubStatus()
            }, 1000)
        })
        .catch(err => setError(err?.response?.data?.message?.general[0]))
}
export function deleteModelClub(id: string, updateClubStatus: Function, setSuccess: Dispatch<SetStateAction<string>>,
    setError: Dispatch<SetStateAction<string>>, setClub: Dispatch<SetStateAction<ClubTableProps>>
) {
    privateGateway.delete(`${tableRoutes.club.delete}${id}/`)
        .then(res => {
            updateClubStatus()
            setSuccess(res?.data?.message?.general[0])
            setTimeout(() => {
                updateClubStatus()
                setClub({} as ClubTableProps)
            }, 1000)
        })
        .catch(err => setError(err?.response?.data?.message?.general[0]))
}
export async function fetchClubs(
    setData: Dispatch<SetStateAction<ClubTableProps[]>>,
    setData2: Dispatch<SetStateAction<ClubTableProps[]>>,
    updateTable?: Function
) {
    await privateGateway.get(tableRoutes.club.list)
        .then(res => res.data.response.clubs)
        .then(data => {
            setData(data)
            setData2(data)

            if (updateTable) updateTable(data)
        })
        .catch(err => {

            console.log('Error :', err?.response?.data?.message?.general[0])
        })
}
export function fetchStatus(setData: Dispatch<SetStateAction<string[]>>, setOptionStatusList: Dispatch<SetStateAction<selectProps[]>>) {
    privateGateway.get(tableRoutes.status.list)
        .then(res => res.data.response.clubStatus)
        .then(data => {
            setData(data)
            setOptionStatusList(data.map((item: selectProps, index: string) => {
                return {
                    id: index,
                    name: item
                }
            }))
        })
        .catch(err => console.log('Error :', err?.response?.data?.message?.general[0]))
}