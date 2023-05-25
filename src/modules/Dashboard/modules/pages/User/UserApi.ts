import { Dispatch, SetStateAction } from "react"
import { UserTableProps } from "./UserTable"
import { setupRoutes, tableRoutes } from "../../../../../services/urls"
import { privateGateway } from "../../../../../services/apiGateway"
import { selectProps } from "../../utils/setupUtils"
import { showAlert } from "../../../components/Error/Alerts"

export function deleteThisUser(id: string, update: Function,
    setSuccessMessage: Dispatch<SetStateAction<string>>,
    setErrorMessage: Dispatch<SetStateAction<string>>,
    setUser: Dispatch<SetStateAction<UserTableProps>>
) {
    privateGateway.delete(`${tableRoutes.user.delete}${id}/`)
        .then(res => {
            setSuccessMessage(res?.data?.message?.general[0])
            setTimeout(() => {
                update()
                setUser({} as UserTableProps)
            }, 1000)
        })
        .catch(err => setErrorMessage(err?.response?.data?.message?.general[0]))
}
export function fetchUserRoles(setData: Dispatch<SetStateAction<selectProps[]>>) {
    privateGateway.get(setupRoutes.user.roles.list)
        .then(res => res.data.response.roles)
        .then(data =>
            setData(data?.map((item: { value: string, label: string }) =>
                ({ id: item.value, name: item.label }))))
        .catch(err => console.log(err))
}
export function createUser(
    name: string,
    email: string,
    phone: string,
    role: string,
    password: string,
    updateUserData: Function,
    setViewSetup: Dispatch<SetStateAction<boolean>>,
    setSuccessMessage: Dispatch<SetStateAction<string>>,
    setErrorMessage: Dispatch<SetStateAction<string>>
) {
    const postData = {
        name: name,
        email: email,
        phone: phone,
        role: role,
        password: password
    }
    privateGateway.post(setupRoutes.user.create, postData)
        .then(res => {
            updateUserData()
            showAlert(res?.data?.message?.general[0], setSuccessMessage)
            console.log('Success :', res?.data?.message?.general[0])
            setTimeout(() => {
                setViewSetup(false)
            }, 3000)
        })
        .catch(err => {
            showAlert(err?.response?.data?.message?.general[0], setErrorMessage)
            console.log('Error :', err?.response?.data?.message?.general[0])
        })
}
export async function fetchUsers(setUserList: Dispatch<SetStateAction<UserTableProps[]>>, setListForTable: Dispatch<SetStateAction<UserTableProps[]>>, updateTable?: Function) {
    await privateGateway.get(tableRoutes.user.list)
        .then(res => res.data.response)
        .then(data => {
            setUserList(data)
            setListForTable(data)
            if (updateTable) updateTable(data)
        })
        .catch(err => console.log('Error :', err?.response?.data?.message?.general[0]))
}