// 'use client'
// import { ArrowRightIcon } from 'lucide-react'
// import Link from 'next/link'

// const PageTitle = ({ heading, text, path = "/", linkText }) => {
//     return (
//         <div className="my-6">
//             <h2 className="text-2xl font-semibold">{heading}</h2>
//             <div className="flex items-center gap-3">
//                 <p className="text-slate-600">{text}</p>
//                 <Link href={path} className="flex items-center gap-1 text-green-500 text-sm">
//                     {linkText} <ArrowRightIcon size={14} />
//                 </Link>
//             </div>
//         </div>
//     )
// }

// export default PageTitle
'use client'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

const PageTitle = ({
    heading,
    highlight,
    text,
    path,
    linkText
}) => {
    return (
        <div className="my-6">
            <h1 className="text-2xl font-medium text-primary flex items-center gap-2">
                {heading}{" "}
                {highlight && (
                    <span className="text-customBlack font-medium">{highlight}</span>
                )}
            </h1>
            <div className="flex items-center gap-3">
                <p className="text-slate-600">{text}</p>
                {path && linkText && (
                    <Link href={path} className="flex items-center gap-1 text-primary text-sm font-medium">
                        {linkText} <ArrowRightIcon size={14} />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default PageTitle
