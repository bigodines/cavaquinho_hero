import { useRouter } from 'next/router'

const GetChords = () => {
    const router = useRouter()
    // comes from next's dynamic routing
    const { root } = router.query

    return <p>Note: {note}</p>
}

export default GetChords
