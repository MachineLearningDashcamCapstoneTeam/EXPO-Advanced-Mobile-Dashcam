import { useEffect, useState } from "react"
import axios from "axios"
//* Custom use fetch hook for loading data on initial screen load
export default function useFetch(url){
    const [data,setData] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)
    useEffect(() => {
        (
            async function(){
                try{
                    setLoading(true)
                    const response = await axios.get(url)
                    setData(response.data)
                }catch(err){
                    setError(err)
                }finally{
                    setLoading(false)
                }
            }
        )()
    }, [url])
    return { data, error, loading }
}