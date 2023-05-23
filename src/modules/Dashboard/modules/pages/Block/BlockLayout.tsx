import React from 'react'
import Setup from './Setup'
import Table from './Table'
import '../../components/Layout.scss'

const BlockLayout = () => {
    return (
        <div className='dash-container'>
            <Setup />
            <Table />
        </div>
    )
}

export default BlockLayout