import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { CustomSelect } from '../../../components/CustomSelect/CustomSelect'
import { selectProps } from '../../utils/setupUtils'
import { Error, Success } from '../../../components/Error/Alerts'
import setupImg from '../../../../../assets/Kindergarten student-bro 1.webp'
import { fetchDistricts } from '../School/SchoolAPI'
import { fetchcolleges } from '../Club/clubAPI'
import { CustomInput } from '../../../components/CustomInput/CustomInput'
import InstituteTable, { InstituteTableProps } from './InstituteTable'
import { privateGateway, publicGateway } from '../../../../../services/apiGateway'
import { campusRoutes, tableRoutes } from '../../../../../services/urls'
import Select from 'react-select'
import { error, errorCheck, success } from '../../../components/Toastify/ToastifyConsts'
import * as yup from 'yup'
import { toast } from 'react-toastify'

const InstituteSetup = () => {
    const [districtList, setDistrictList] = useState<selectProps[]>([])
    const [instituteList, setInstituteList] = useState<selectProps[]>([])
    const [district, setDistrict] = useState<selectProps>({} as selectProps)
    const [institute, setInstitute] = useState<selectProps>({} as selectProps)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [ICT, setICT] = useState("")
    const [update, setUpdate] = useState(false)
    const [viewSetup, setViewSetup] = useState(false)
    const [close, setClose] = useState(true)
    useEffect(() => {
        fetchDistricts(setDistrictList)
    }, [])
    useEffect(() => {
        if (district?.id) {
            fetchInstitutes(district.name, setInstituteList)
        }
    }, [district?.id])
    function validateSchema() {
        const validationSchema = yup.object().shape({
            district: yup.string().required('District is required'),
            institute: yup.string().required('Institute is required'),
            ICT: yup.string().required('ICT Id is required').test('only-spaces', 'Only spaces are not allowed for ICT Id', value => {
                // Check if the value consists only of spaces
                return !(/^\s+$/.test(value));
            }),
        })
        return validationSchema.validate(
            { district: district.name, institute: institute.name, ICT: ICT },
            { abortEarly: false }
        )
    }
    function handleConnect() {
        validateSchema().then(() => {
            connectInstitute(institute.name, institute.id, district.name, ICT, setError, setSuccess, setUpdate, setViewSetup, reset)
        })
            .catch(err => err.errors.map((error: string) => toast.error(error)))

    }
    function reset() {
        setDistrict({} as selectProps)
        setInstitute({} as selectProps)
        setInstituteList([])
        setICT("")
        setClose(false)
        setTimeout(() => {
            setClose(true)
        }, 1)

    }
    return (
        <div className='dash-container'>
            {viewSetup && <div className="white-container">
                <h3>Connect </h3>
                <div className="setup-club">
                    <div className="setup-filter">
                        <div className="select-container club">
                            {close && <CustomSelect option={districtList} header="District" setData={setDistrict} />}
                            {close && <CustomSelect option={instituteList} header="Institute" setData={setInstitute} />}
                            <CustomInput requiredHeader={true} value="ICT ID" setData={setICT} data={ICT} />
                            <div className="create-btn-container">
                                <button className="black-btn"
                                    onClick={handleConnect}>Create</button>
                                <button className="black-btn"
                                    onClick={() => setViewSetup(false)}
                                >Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div className="setup-img">
                        <img src={setupImg} alt="HI" />
                    </div>
                </div>

            </div>}
            <InstituteTable update={update} viewSetup={() => setViewSetup((prev: boolean) => !prev)} />
        </div>
    )
}
function fetchInstitutes(district: string, setData: Dispatch<SetStateAction<selectProps[]>>) {
    privateGateway.get(`${campusRoutes.listInstitutesByDistrict}${district}/`)
        .then(res => (res.data.response.institutes))
        .then(data =>
            setData(data.map((institute: { id: string, title: string, district: string }) => ({
                id: institute.id,
                name: institute.title,
            }))))
        .catch(err => console.log(err))
}
function connectInstitute(name: string, id: string, district: string, ict: string, setError: Dispatch<SetStateAction<string>>,
    setSuccess: Dispatch<SetStateAction<string>>, setUpdate: Dispatch<SetStateAction<boolean>>,
    setViewSetup: Dispatch<SetStateAction<boolean>>,
    reset: () => void
) {
    // name,id,distict,ict_id
    privateGateway.post(campusRoutes.connectIctToInstitute, {
        name: name,
        instituteId: id,
        district: district,
        ict_id: ict,
        type: 'College'
    }).then((res) => {
        console.log(res)
        setUpdate((prev: boolean) => !prev)
        reset()
        // setSuccess(res?.data?.message?.general[0])
        success();
    })
        .catch((err) => {
            if (err.response.data.response.ict_id) {
                error(err.response.data.response.ict_id[0]);
            }
            else {
                error("Something went wrong")
            }
            // setError(err?.response?.data?.message?.general[0])

        })
}
export default InstituteSetup