import React from 'react'
import Setup from './Setup'
import Table from './Table'
import Banner from './Banner'
import '../../components/Layout.scss'

const ClubLayout = () => {
    return (
        <div className='dash-container'>
            <Banner />
            <Setup />
            <Table />
        </div>)
}

export default ClubLayout