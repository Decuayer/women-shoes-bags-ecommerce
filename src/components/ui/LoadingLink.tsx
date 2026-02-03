'use client'

import Link from 'next/link'
import { useLoading } from '@/context/LoadingContext'
import { ComponentProps, MouseEvent } from 'react'

type LoadingLinkProps = ComponentProps<typeof Link>

export default function LoadingLink({ onClick, ...props }: LoadingLinkProps) {
    const { showLoading } = useLoading()

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        showLoading()
        onClick?.(e)
    }

    return <Link onClick={handleClick} {...props} />
}
