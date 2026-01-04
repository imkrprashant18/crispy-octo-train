"use client"

import { auth } from "@clerk/nextjs/server";


const AdminPage = () => {
        const data = auth();
        console.log(data)
        return (
                <div>AdminPage</div>
        )
}

export default AdminPage