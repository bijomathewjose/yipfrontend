import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import setupImg from '../../../../../assets/Kindergarten student-bro 1.webp'
import { CustomInput } from '../../../components/CustomInput/CustomInput'
import { CustomSelect } from '../../../components/CustomSelect/CustomSelect'
import '../../components/Setup.scss'
import { initialState, selectProps } from '../../utils/setupUtils'
import * as yup from 'yup'
import { showAlert, Error, Success } from '../../../components/Error/Alerts'
import { createUser, fetchUserByRoles, fetchUserRoles } from './UserApi'
import { fetchDistricts } from '../School/SchoolAPI'
import Select from 'react-select'
import { UserTableProps as UserProps } from './UserTable'
import { privateGateway } from '../../../../../services/apiGateway'
import { campusRoutes } from '../../../../../services/urls'
import styles from './UserSetup.module.css'
interface UserTableProps {
    setViewSetup: Dispatch<SetStateAction<boolean>>
    updateUserData: Function
}
const UserSetup: FC<UserTableProps> = ({ setViewSetup, updateUserData }) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState<string>('')
    const [password, setPassword] = useState("")
    const [role, setRole] = useState(initialState)
    const [roleList, setRoleList] = useState<selectProps[]>([])
    const [district, setDistrict] = useState<selectProps>({} as selectProps)
    const [districtList, setDistrictList] = useState<selectProps[]>([])
    const [zone, setZone] = useState<selectProps>({} as selectProps)
    const [zoneList, setZoneList] = useState<selectProps[]>([{ id: '0', name: 'North' }, { id: '1', name: 'South' }, { id: '2', name: 'Central' }])
    const [coordinatorList, setCoordinatorList] = useState<selectProps[]>([])
    const [coordinator, setCoordinator] = useState<selectProps>({} as selectProps)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [coordinatorInternRole, setCoordinatorInternRole] = useState<selectProps>({} as selectProps)
    const [coordinatorRoleBasedList, setCoordinatorRoleBasedList] = useState<UserProps[]>([] as UserProps[])
    const [instituteList, setInstituteList] = useState<selectProps[]>([])
    const [selectedInstitute, setSelectedInstitute] = useState<selectProps[]>([])
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const reset = () => {
        setName("")
        setEmail("")
        setPhone("")
        setPassword("")
        setRole(initialState)
        setViewSetup(false)
    }
    useEffect(() => {
        fetchUserRoles(setRoleList)
        fetchDistricts(setDistrictList)
        fetchUserByRoles(setCoordinatorRoleBasedList)
    }, [])
    useEffect(() => {
        if (coordinator.id)
            getSelectedInstitutes(coordinator.id, setInstituteList)
    }, [coordinator])

    function handleCreate() {


        createUser(name, email, phone, role.id, password, district.name, zone.name, updateUserData, setViewSetup, setSuccessMessage, setErrorMessage, coordinator.id, selectedInstitute)

    }
    return (
        <div className="white-container">
            <h3>Setup a User</h3>
            <div className="setup-club">
                <div className="setup-filter">
                    <div className="select-container club">
                        <CustomInput value="Name" setData={setName} data={name} />
                        <CustomInput value="Email" type='email' setData={setEmail} data={email} />
                        <CustomInput value="Phone" type='phone' setData={setPhone} data={phone} />
                        <CustomSelect
                            option={roleList}
                            header='Role'
                            setData={setRole}
                            isSearchable={false}
                        />
                        {(role.name === 'District Coordinator' || role.name === 'Programme Executive') && <CustomSelect
                            option={districtList}
                            header={'Coordinator District'}
                            setData={setDistrict}
                            isSearchable={true}
                        />}
                        {(role.name === 'Zonal Coordinator') && <CustomSelect
                            option={zoneList}
                            header={'Coordinator Zone'}
                            setData={setZone}
                            isSearchable={true}
                        />}
                        {(role.name === 'Intern') &&
                            <>
                                <CustomSelect
                                    option={role.name === 'Intern' ? coordinatorRoleBasedList : []}
                                    header={'Coordinator'}
                                    setData={setCoordinator}
                                    isSearchable={true}
                                />
                                <div className={"setup-item"}>
                                    <p>Select Institutes</p>
                                    <Select
                                        className='react-select-container'
                                        options={instituteList}
                                        placeholder={'Select Institutes'}
                                        isMulti={true}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        onChange={(data: any) => {
                                            if (data) {
                                                setSelectedInstitute(data)
                                                console.log(data)
                                            }
                                            else
                                                setSelectedInstitute([])
                                        }}
                                    />
                                </div>
                            </>
                        }
                        <div className={styles.password}>
                            <input value={password} placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : "password"} className={styles.input} />
                            <i className='fas fa-eye' onMouseDown={() => setShowPassword(true)} onMouseOut={() => setShowPassword(false)}></i>
                        </div>
                        <div className="create-btn-container">
                            <button className="black-btn"
                                onClick={handleCreate}>Create</button>
                            <button className="black-btn"
                                onClick={reset}
                            >Cancel</button>
                        </div>
                    </div>
                </div>
                <div className="setup-img">
                    <img src={setupImg} alt="  " />
                </div>
            </div>
            {errorMessage && <Error error={errorMessage} />}
            {successMessage && <Success success={successMessage} />}
        </div>
    )
}
function getSelectedInstitutes(userId: string, setInstituteList: Dispatch<SetStateAction<selectProps[]>>) {
    privateGateway.get(`${campusRoutes.listInstituteByUser}${userId}/`)
        .then((res) => {
            setInstituteList(res.data.response)
        })
        .catch((err) => {
            console.error(err)
        })
}

export default UserSetup 