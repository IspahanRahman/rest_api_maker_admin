import React from 'react'
import UpdatePackage from '@/components/core-panel/admin-panel/pages/update-package/UpdatePackage'

export default async function UpdatePackagePage({ params }: { params: Promise<{ id?: string }> }) {
    const resolvedParams = await params;
    return (
        <UpdatePackage packageId={resolvedParams.id ?? ''} />
    )
}
