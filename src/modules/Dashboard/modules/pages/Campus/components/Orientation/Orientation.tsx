import React, { useContext, useEffect } from 'react'
import StatusTable from '../StatusTable/StatusTable'
import CampusModal from '../Modals/CampusModal'
import { listEvent } from './OrientationScheduleModal'
import CustomTable from '../../../../components/CustomTable/CustomTable'
import { GlobalContext } from '../../../../../../../utils/GlobalVariable'
export interface OrientationCompleteProps {
    id: string
    place: string
    mode_of_delivery: string
    districtCordinator: string
    no_of_participants: string
    scheduled_date: string
    remarks: string
    status: string
    completed_date: string
    description: string
    planned_date: string
}
export interface OrientationProps {
    id: string
    scheduled: boolean
    date: string
    completed: OrientationCompleteProps[]
}

const Orientation = ({ date = '', campusId, district, update }: { date: string, campusId: string, district: string, update: boolean }) => {
    const [open, setOpen] = React.useState(false)
    const [orientationList, setOrientationList] = React.useState<OrientationCompleteProps[]>([])
    const [eventId, setEventId] = React.useState<string>('')
    const [value, setValue] = React.useState('')
    const [addOrientation, setAddOrientation] = React.useState(false)
    const { clubEvents } = useContext(GlobalContext)
    useEffect(() => {
        let eventScheduled = clubEvents.find((item: any) => item.status === 'Scheduled')
        let eventCompleted = clubEvents.find((item: any) => item.status === 'Completed')
        setOrientationList(clubEvents)
        if (eventCompleted?.status) {
            setAddOrientation(true)
        }
        if (eventScheduled?.status) {
            setAddOrientation(false)
        }
    }, [open, campusId, update, clubEvents])
    return (
        <div>
            {open && <CampusModal campuStatus={value} campusId={campusId} cancel={() => setOpen(!open)} district={district} eventId={eventId as string} />}
            <div>
                <div>
                    <div className='top-bar'>
                        <p>Events Scheduled</p>
                        {/* {addOrientation && <div className='add-button' onClick={() => {
                            setOpen(true)
                            setValue('Connection Established')
                        }}>
                            <i className='fas fa-add'></i>
                            <p >Add Event</p>
                        </div>} */}
                    </div>
                    <CustomTable
                        tableHeadList={['Mode of Delivery', 'Coordinator', 'Place', 'No of Participants', 'Remarks', 'Scheduled On', 'Planned Date', 'Completed On', 'Status']}
                        tableData={orientationList}
                        orderBy={['mode_of_delivery', 'districtCordinator', 'place', 'no_of_participants', 'remarks', 'scheduled_date', 'planned_date', 'completed_date', 'status']}
                        capitalize={false}
                        // manage={
                        //     {
                        //         value: 'Update',
                        //         manageFunction: (item: any) => { setEventId(item.id); setOpen(true); setValue('Orientation Update') },
                        //     }
                        // }
                        pagination={false}
                        filter={false}
                    />
                </div>
            </div >
        </div>
    )
}

export default Orientation