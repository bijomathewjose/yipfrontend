import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { CustomSelect } from '../../../components/CustomSelect/CustomSelect'
import { selectProps } from '../../utils/setupUtils'
import { Error, Success } from '../../../components/Error/Alerts'
import setupImg from '../../../../../assets/Kindergarten student-bro 1.png'
import { fetchDistricts } from '../School/SchoolAPI'
import { fetchcolleges } from '../Club/clubAPI'
import { CustomInput } from '../../../components/CustomInput/CustomInput'
import InstituteTable, { InstituteTableProps } from './InstituteTable'
import { privateGateway, publicGateway } from '../../../../../services/apiGateway'
import { campusRoutes, tableRoutes } from '../../../../../services/urls'
import Select from 'react-select'

const InstituteSetup = () => {
    const [districtList, setDistrictList] = useState<selectProps[]>([])
    const [instituteList, setInstituteList] = useState<selectProps[]>([])
    const [district, setDistrict] = useState<selectProps>({} as selectProps)
    const [institute, setInstitute] = useState<selectProps>({} as selectProps)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [ICT, setICT] = useState("")
    useEffect(() => {
        fetchDistricts(setDistrictList)
    }, [])
    useEffect(() => {
        if (district?.id) {
            fetchInstitutes(district.name, setInstituteList)
        }
    }, [district?.id])
    function handleConnect() {
        connectInstitute(institute.name, institute.id, district.name, ICT, setError, setSuccess)
    }
    function reset() {
        setDistrict({} as selectProps)
        setInstitute({} as selectProps)
        setDistrictList([])
        setInstituteList([])
    }
    return (
        <div className='dash-container'>
            <div className="white-container">
                <h3>Connect </h3>
                <div className="setup-club">
                    <div className="setup-filter">
                        <div className="select-container club">
                            <CustomSelect option={districtList} header="District" setData={setDistrict} />
                            <CustomSelect option={instituteList} header="Institute" setData={setInstitute} />
                            <CustomInput requiredHeader={true} value="ICT Id" setData={setICT} data={ICT} />
                            <div className="create-btn-container">
                                <button className="black-btn"
                                    onClick={handleConnect}>Create</button>
                                <button className="black-btn"
                                    onClick={reset}
                                >Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div className="setup-img">
                        <img src={setupImg} alt="HI" />
                    </div>
                </div>
                {error && <Error error={error} />}
                {success && <Success success={success} />}
            </div>
            <InstituteTable />
        </div>
    )
}
function fetchInstitutes(district: string, setData: Dispatch<SetStateAction<selectProps[]>>) {
    publicGateway.get(`${campusRoutes.listInstitutesByDistrict}${district}/`)
        .then(res => (res.data.response))
        .then(data =>
            setData(data.map((institute: { id: string, title: string, district: string }) => ({
                id: institute.id,
                name: institute.title
            }))))
        .catch(err => console.log(err))
}
function connectInstitute(name: string, id: string, district: string, ict: string, setError: Dispatch<SetStateAction<string>>, setSuccess: Dispatch<SetStateAction<string>>) {
    // name,id,distict,ict_id
    privateGateway.post(campusRoutes.connectIctToInstitute, {
        name: name,
        instituteId: id,
        district: district,
        ict_id: ict
    }).then((res) => {
        console.log(res)
        setSuccess(res?.data?.message?.general[0])
        setTimeout(() => {
            setSuccess("")
        }, 3000)
    })
        .catch((err) => {
            console.log(err)
            setError(err?.response?.data?.message?.general[0])

            setTimeout(() => {
                setError("")
            }, 3000)
        })
}
export default InstituteSetup